import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

interface AdminContentManagerProps {
  tableName: string;
  tabId: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const fieldConfigs: Record<string, { fields: { key: string; label: string; type: string; options?: string[] }[] }> = {
  news: {
    fields: [
      { key: "title_en", label: "Title (English)", type: "text" },
      { key: "summary_en", label: "Summary (English)", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  schemes: {
    fields: [
      { key: "name_en", label: "Scheme Name (English)", type: "text" },
      { key: "eligibility_en", label: "Eligibility (English)", type: "textarea" },
      { key: "benefit_en", label: "Benefit (English)", type: "textarea" },
      { key: "apply_link", label: "Apply Link", type: "text" },
      { key: "scheme_type", label: "Type", type: "select", options: ["central", "ap", "ts"] },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  alerts: {
    fields: [
      { key: "message_en", label: "Alert Message (English)", type: "textarea" },
      { key: "alert_type", label: "Type", type: "select", options: ["info", "warning", "danger"] },
      { key: "active", label: "Active", type: "checkbox" },
    ],
  },
  farming_methods: {
    fields: [
      { key: "name_en", label: "Name (English)", type: "text" },
      { key: "description_en", label: "Description (English)", type: "textarea" },
      { key: "emoji", label: "Emoji", type: "text" },
      { key: "image_url", label: "Image URL", type: "text" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
  videos: {
    fields: [
      { key: "title_en", label: "Title (English)", type: "text" },
      { key: "youtube_id", label: "YouTube Video ID", type: "text" },
      { key: "emoji", label: "Emoji", type: "text" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
  },
};

const translateContent = async (texts: Record<string, string>, fields: string[]) => {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, fields }),
    });
    if (!resp.ok) return {};
    return await resp.json();
  } catch {
    return {};
  }
};

const AdminContentManager = ({ tableName, tabId }: AdminContentManagerProps) => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: [`admin_${tableName}`],
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const config = fieldConfigs[tableName];

  const handleNew = () => {
    const newItem: Record<string, any> = {};
    config.fields.forEach((f) => {
      if (f.type === "checkbox") newItem[f.key] = true;
      else if (f.type === "select" && f.options) newItem[f.key] = f.options[0];
      else newItem[f.key] = "";
    });
    setEditingItem(newItem);
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);

    try {
      // Auto-translate English fields to Telugu
      const enFields: Record<string, string> = {};
      const fieldNames: string[] = [];
      config.fields.forEach((f) => {
        if (f.key.endsWith("_en") && editingItem[f.key]) {
          const baseName = f.key.replace("_en", "");
          enFields[baseName] = editingItem[f.key];
          fieldNames.push(baseName);
        }
      });

      let translations: Record<string, string> = {};
      if (fieldNames.length > 0) {
        translations = await translateContent(enFields, fieldNames);
      }

      // Merge translations into item
      const saveData = { ...editingItem };
      Object.entries(translations).forEach(([key, value]) => {
        saveData[key] = value;
      });

      // Remove id for new items
      if (isNew) {
        delete saveData.id;
        delete saveData.created_at;
        delete saveData.updated_at;
        const { error } = await supabase.from(tableName as any).insert(saveData as any);
        if (error) throw error;
        toast.success("Created successfully! Telugu translation added.");
      } else {
        const { id, created_at, updated_at, ...updateData } = saveData;
        const { error } = await supabase.from(tableName as any).update(updateData as any).eq("id", id);
        if (error) throw error;
        toast.success("Updated successfully! Telugu translation updated.");
      }

      setEditingItem(null);
      setIsNew(false);
      queryClient.invalidateQueries({ queryKey: [`admin_${tableName}`] });
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from(tableName as any).delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: [`admin_${tableName}`] });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">
          {tableName.replace("_", " ").toUpperCase()} ({items?.length || 0})
        </h3>
        <button onClick={handleNew} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold active:scale-95 transition-transform">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Edit Form */}
      {editingItem && (
        <div className="bg-card rounded-2xl p-6 border-2 border-primary/30 mb-6 space-y-4">
          <h4 className="font-bold text-foreground">{isNew ? "New Item" : "Edit Item"}</h4>
          <p className="text-xs text-muted-foreground">✨ Enter content in English — Telugu translation will be generated automatically!</p>

          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-bold text-foreground mb-1">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={editingItem[field.key] || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={editingItem[field.key] || false}
                  onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.checked })}
                  className="w-5 h-5 rounded accent-primary"
                />
              ) : field.type === "select" ? (
                <select
                  value={editingItem[field.key] || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary"
                >
                  {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={editingItem[field.key] || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50">
              <Save size={16} /> {saving ? "Saving & Translating..." : "Save & Auto-Translate"}
            </button>
            <button onClick={() => { setEditingItem(null); setIsNew(false); }} className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold active:scale-95 transition-transform">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !items?.length ? (
        <p className="text-center text-muted-foreground py-12">No items yet. Click "Add New" to create one.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">
                  {item.title_en || item.name_en || item.message_en || item.youtube_id || "—"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.title_te || item.name_te || item.message_te || "No Telugu translation"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(item.created_at).toLocaleDateString()}
                  {" • "}
                  {item.published !== undefined ? (item.published ? "✅ Published" : "❌ Draft") : (item.active ? "✅ Active" : "❌ Inactive")}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditingItem({ ...item }); setIsNew(false); }} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold active:scale-95 transition-transform">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg active:scale-95 transition-transform">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContentManager;
