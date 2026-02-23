export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          active: boolean | null
          alert_type: string
          created_at: string
          expires_at: string | null
          id: string
          message_en: string
          message_te: string | null
        }
        Insert: {
          active?: boolean | null
          alert_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          message_en: string
          message_te?: string | null
        }
        Update: {
          active?: boolean | null
          alert_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          message_en?: string
          message_te?: string | null
        }
        Relationships: []
      }
      farming_methods: {
        Row: {
          benefits_en: string | null
          benefits_te: string | null
          category: string | null
          created_at: string
          description_en: string | null
          description_te: string | null
          difficulty: string | null
          emoji: string | null
          id: string
          image_url: string | null
          name_en: string
          name_te: string | null
          published: boolean | null
          steps_en: string | null
          steps_te: string | null
          suitable_crops_en: string | null
          suitable_crops_te: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          benefits_en?: string | null
          benefits_te?: string | null
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_te?: string | null
          difficulty?: string | null
          emoji?: string | null
          id?: string
          image_url?: string | null
          name_en: string
          name_te?: string | null
          published?: boolean | null
          steps_en?: string | null
          steps_te?: string | null
          suitable_crops_en?: string | null
          suitable_crops_te?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          benefits_en?: string | null
          benefits_te?: string | null
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_te?: string | null
          difficulty?: string | null
          emoji?: string | null
          id?: string
          image_url?: string | null
          name_en?: string
          name_te?: string | null
          published?: boolean | null
          steps_en?: string | null
          steps_te?: string | null
          suitable_crops_en?: string | null
          suitable_crops_te?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          created_at: string
          id: string
          published: boolean | null
          summary_en: string | null
          summary_te: string | null
          title_en: string
          title_te: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          published?: boolean | null
          summary_en?: string | null
          summary_te?: string | null
          title_en: string
          title_te?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          published?: boolean | null
          summary_en?: string | null
          summary_te?: string | null
          title_en?: string
          title_te?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      schemes: {
        Row: {
          apply_link: string | null
          benefit_en: string | null
          benefit_te: string | null
          created_at: string
          eligibility_en: string | null
          eligibility_te: string | null
          id: string
          name_en: string
          name_te: string | null
          published: boolean | null
          scheme_type: string
          updated_at: string
        }
        Insert: {
          apply_link?: string | null
          benefit_en?: string | null
          benefit_te?: string | null
          created_at?: string
          eligibility_en?: string | null
          eligibility_te?: string | null
          id?: string
          name_en: string
          name_te?: string | null
          published?: boolean | null
          scheme_type?: string
          updated_at?: string
        }
        Update: {
          apply_link?: string | null
          benefit_en?: string | null
          benefit_te?: string | null
          created_at?: string
          eligibility_en?: string | null
          eligibility_te?: string | null
          id?: string
          name_en?: string
          name_te?: string | null
          published?: boolean | null
          scheme_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          emoji: string | null
          id: string
          published: boolean | null
          title_en: string
          title_te: string | null
          youtube_id: string
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          id?: string
          published?: boolean | null
          title_en: string
          title_te?: string | null
          youtube_id: string
        }
        Update: {
          created_at?: string
          emoji?: string | null
          id?: string
          published?: boolean | null
          title_en?: string
          title_te?: string | null
          youtube_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
