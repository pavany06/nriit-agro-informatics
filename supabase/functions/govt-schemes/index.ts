import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Comprehensive real Indian Government Agriculture & Farmer Schemes
const schemes = [
  {
    id: "pm-kisan",
    name_en: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    name_te: "PM-KISAN (ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Direct income support scheme providing ₹6,000 per year in three equal installments of ₹2,000 to all landholding farmer families across India. Over 11 crore farmers benefit. The amount is directly transferred to bank accounts.",
    brief_te: "భారతదేశంలో భూమి కలిగిన అన్ని రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 ప్రత్యక్ష ఆదాయ మద్దతు - ₹2,000 చొప్పున మూడు సమాన వాయిదాల్లో. 11 కోట్లకు పైగా రైతులు లబ్ధిదారులు.",
    eligibility_en: "All landholding farmer families with cultivable land. Small & marginal farmers included.",
    eligibility_te: "సాగు భూమి ఉన్న అన్ని రైతు కుటుంబాలు. చిన్న & సన్నకారు రైతులు చేర్చబడ్డారు.",
    benefit_en: "₹6,000/year (₹2,000 × 3 installments) directly to bank account",
    benefit_te: "₹6,000/సంవత్సరం (₹2,000 × 3 వాయిదాలు) నేరుగా బ్యాంక్ ఖాతాకు",
    apply_link: "https://pmkisan.gov.in",
    documents_en: "Aadhaar card, Land records, Bank account details",
    documents_te: "ఆధార్ కార్డు, భూమి రికార్డులు, బ్యాంక్ ఖాతా వివరాలు",
    status: "active",
  },
  {
    id: "pmfby",
    name_en: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    name_te: "PMFBY (ప్రధాన మంత్రి ఫసల్ బీమా యోజన)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Crop insurance scheme protecting farmers against crop loss due to natural calamities, pests, and diseases. Premium is very low: 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticulture crops. Government subsidizes the rest.",
    brief_te: "ప్రకృతి విపత్తులు, పురుగులు, వ్యాధుల వల్ల పంట నష్టం నుండి రైతులను రక్షించే పంట బీమా పథకం. ప్రీమియం చాలా తక్కువ: ఖరీఫ్‌కు 2%, రబీకి 1.5%.",
    eligibility_en: "All farmers growing notified crops in notified areas. Both loanee and non-loanee farmers.",
    eligibility_te: "నోటిఫైడ్ ప్రాంతాల్లో నోటిఫైడ్ పంటలు పండించే అన్ని రైతులు.",
    benefit_en: "Crop insurance at subsidized premium (2% Kharif, 1.5% Rabi). Full sum insured on crop loss.",
    benefit_te: "సబ్సిడీ ప్రీమియంతో పంట బీమా (ఖరీఫ్ 2%, రబీ 1.5%). పంట నష్టంపై పూర్తి బీమా మొత్తం.",
    apply_link: "https://pmfby.gov.in",
    documents_en: "Land records, Sowing certificate, Bank account, Aadhaar",
    documents_te: "భూమి రికార్డులు, విత్తన ధృవీకరణ, బ్యాంక్ ఖాతా, ఆధార్",
    status: "active",
  },
  {
    id: "kcc",
    name_en: "Kisan Credit Card (KCC)",
    name_te: "కిసాన్ క్రెడిట్ కార్డ్ (KCC)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Provides farmers with affordable credit for agriculture and allied activities. Interest rate is 4% (with subsidy). Covers crop cultivation, post-harvest expenses, farm maintenance, and animal husbandry. Credit limit based on land holding.",
    brief_te: "వ్యవసాయం కోసం రైతులకు తక్కువ వడ్డీకి రుణం. వడ్డీ రేటు 4% (సబ్సిడీతో). పంట సాగు, పంటకోత తర్వాత ఖర్చులు, పశుపోషణ కవర్.",
    eligibility_en: "All farmers - individual/joint, tenant farmers, sharecroppers, SHGs, JLGs",
    eligibility_te: "అన్ని రైతులు - వ్యక్తిగత/ఉమ్మడి, కౌలు రైతులు, పంచదార రైతులు, SHG లు",
    benefit_en: "Credit up to ₹3 lakh at 4% interest. Crop loan + term loan + consumption needs.",
    benefit_te: "₹3 లక్షల వరకు 4% వడ్డీకి రుణం. పంట రుణం + కాల రుణం + వినియోగ అవసరాలు.",
    apply_link: "https://www.pmkisan.gov.in/KCC.aspx",
    documents_en: "Land records, Identity proof, Passport photo, Bank form",
    documents_te: "భూమి రికార్డులు, గుర్తింపు రుజువు, పాస్‌పోర్ట్ ఫోటో, బ్యాంక్ ఫారం",
    status: "active",
  },
  {
    id: "pm-kmy",
    name_en: "PM-KMY (Pradhan Mantri Kisan Maandhan Yojana)",
    name_te: "PM-KMY (ప్రధాన మంత్రి కిసాన్ మానధన్ యోజన)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Pension scheme for small and marginal farmers. After age 60, farmers receive ₹3,000/month pension. Farmers contribute ₹55-200/month (age-based). Government matches equal contribution. Voluntary & contributory.",
    brief_te: "చిన్న & సన్నకారు రైతులకు పెన్షన్ పథకం. 60 ఏళ్ళ తర్వాత నెలకు ₹3,000 పెన్షన్. రైతులు నెలకు ₹55-200 చెల్లిస్తారు. ప్రభుత్వం సమాన మొత్తం జమ చేస్తుంది.",
    eligibility_en: "Small & marginal farmers aged 18-40 with less than 2 hectares land",
    eligibility_te: "18-40 ఏళ్ళ మధ్య 2 హెక్టార్ల కంటే తక్కువ భూమి ఉన్న చిన్న & సన్నకారు రైతులు",
    benefit_en: "₹3,000/month pension after age 60. Family pension for spouse.",
    benefit_te: "60 ఏళ్ళ తర్వాత నెలకు ₹3,000 పెన్షన్. భార్య/భర్తకు కుటుంబ పెన్షన్.",
    apply_link: "https://maandhan.in",
    documents_en: "Aadhaar, Land records, Bank/Jan Dhan account, Age proof",
    documents_te: "ఆధార్, భూమి రికార్డులు, బ్యాంక్/జన్ ధన్ ఖాతా, వయస్సు రుజువు",
    status: "active",
  },
  {
    id: "soil-health",
    name_en: "Soil Health Card Scheme",
    name_te: "సాయిల్ హెల్త్ కార్డ్ పథకం",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Provides soil health cards to farmers with crop-wise recommendations for nutrients and fertilizers. Soil is tested for 12 parameters including pH, organic carbon, N, P, K, S, Zn, Fe, Cu, Mn, B. Cards issued every 2 years.",
    brief_te: "రైతులకు పంట వారీగా పోషకాలు & ఎరువుల సిఫారసులతో మట్టి ఆరోగ్య కార్డులు. pH, కర్బనం, N, P, K తో సహా 12 పారామీటర్లకు మట్టి పరీక్ష. ప్రతి 2 సంవత్సరాలకు కార్డులు.",
    eligibility_en: "All farmers across India",
    eligibility_te: "భారతదేశంలో అన్ని రైతులు",
    benefit_en: "Free soil testing and crop-wise nutrient recommendations. Helps optimize fertilizer use.",
    benefit_te: "ఉచిత మట్టి పరీక్ష & పంట వారీ పోషక సిఫారసులు. ఎరువుల వాడకం ఆప్టిమైజ్ చేయడం.",
    apply_link: "https://soilhealth.dac.gov.in",
    documents_en: "Land details, Village/Block info",
    documents_te: "భూమి వివరాలు, గ్రామం/బ్లాక్ సమాచారం",
    status: "active",
  },
  {
    id: "enam",
    name_en: "e-NAM (National Agriculture Market)",
    name_te: "e-NAM (జాతీయ వ్యవసాయ మార్కెట్)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Online trading platform for agricultural commodities. Connects APMC mandis across India for transparent price discovery and better price realization for farmers. Over 1,000 mandis connected.",
    brief_te: "వ్యవసాయ వస్తువుల ఆన్‌లైన్ వ్యాపార వేదిక. పారదర్శక ధర కనుగొనడం & రైతులకు మెరుగైన ధర కోసం భారతదేశం అంతటా APMC మండీలను అనుసంధానం. 1,000+ మండీలు.",
    eligibility_en: "All farmers, traders, buyers registered with APMC mandis",
    eligibility_te: "APMC మండీలతో నమోదు అయిన అన్ని రైతులు, వ్యాపారులు, కొనుగోలుదారులు",
    benefit_en: "Better prices, transparent bidding, reduced intermediaries, online payment",
    benefit_te: "మెరుగైన ధరలు, పారదర్శక వేలం, తగ్గిన మధ్యవర్తులు, ఆన్‌లైన్ చెల్లింపు",
    apply_link: "https://enam.gov.in",
    documents_en: "APMC license, Bank account, Identity proof",
    documents_te: "APMC లైసెన్స్, బ్యాంక్ ఖాతా, గుర్తింపు రుజువు",
    status: "active",
  },
  {
    id: "pkvy",
    name_en: "Paramparagat Krishi Vikas Yojana (PKVY)",
    name_te: "పరంపరాగత్ కృషి వికాస్ యోజన (PKVY)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Promotes organic farming through cluster approach. Farmers get ₹50,000/hectare over 3 years for organic inputs, certification, and marketing. Each cluster has 50+ farmers covering 20+ hectares.",
    brief_te: "క్లస్టర్ విధానం ద్వారా సేంద్రియ వ్యవసాయాన్ని ప్రోత్సహిస్తుంది. రైతులకు 3 సంవత్సరాలలో హెక్టారుకు ₹50,000 సేంద్రియ ఇన్‌పుట్‌లు, ధృవీకరణ, మార్కెటింగ్ కోసం.",
    eligibility_en: "Farmer groups/clusters willing to adopt organic farming (minimum 50 farmers, 20 hectares)",
    eligibility_te: "సేంద్రియ వ్యవసాయం స్వీకరించడానికి సిద్ధంగా ఉన్న రైతు సమూహాలు (కనీసం 50 రైతులు, 20 హెక్టార్లు)",
    benefit_en: "₹50,000/hectare over 3 years. Organic certification, marketing support.",
    benefit_te: "3 సంవత్సరాలలో హెక్టారుకు ₹50,000. సేంద్రియ ధృవీకరణ, మార్కెటింగ్ మద్దతు.",
    apply_link: "https://pgsindia-ncof.gov.in",
    documents_en: "Group formation docs, Land records, Bank details",
    documents_te: "సమూహ ఏర్పాటు పత్రాలు, భూమి రికార్డులు, బ్యాంక్ వివరాలు",
    status: "active",
  },
  {
    id: "smam",
    name_en: "Sub-Mission on Agricultural Mechanization (SMAM)",
    name_te: "వ్యవసాయ యంత్రీకరణ ఉప మిషన్ (SMAM)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Subsidies for purchasing farm machinery and equipment. 40-50% subsidy for SC/ST/small/marginal farmers, 25-40% for others. Covers tractors, harvesters, tillers, sprayers, drip irrigation systems.",
    brief_te: "వ్యవసాయ యంత్రాలు & పరికరాల కొనుగోలుకు సబ్సిడీలు. SC/ST/చిన్న/సన్నకారు రైతులకు 40-50% సబ్సిడీ, ఇతరులకు 25-40%. ట్రాక్టర్లు, హార్వెస్టర్లు, డ్రిప్ ఇరిగేషన్.",
    eligibility_en: "All farmers. Higher subsidy for SC/ST, small & marginal farmers, women, NE states",
    eligibility_te: "అన్ని రైతులు. SC/ST, చిన్న & సన్నకారు రైతులు, మహిళలకు ఎక్కువ సబ్సిడీ",
    benefit_en: "25-50% subsidy on farm machinery purchase. Custom Hiring Centers support.",
    benefit_te: "వ్యవసాయ యంత్రాల కొనుగోలుపై 25-50% సబ్సిడీ. కస్టమ్ హైరింగ్ సెంటర్ల మద్దతు.",
    apply_link: "https://agrimachinery.nic.in",
    documents_en: "Aadhaar, Land records, Bank account, Caste certificate (if applicable)",
    documents_te: "ఆధార్, భూమి రికార్డులు, బ్యాంక్ ఖాతా, కులం ధృవీకరణ (వర్తిస్తే)",
    status: "active",
  },
  {
    id: "pmksy",
    name_en: "PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)",
    name_te: "PMKSY (ప్రధాన మంత్రి కృషి సించాయీ యోజన)",
    type: "central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    brief_en: "Ensures access to irrigation ('Har Khet Ko Paani'). Promotes micro-irrigation (drip & sprinkler) with 55% subsidy for small farmers and 45% for others. Per Drop More Crop component focuses on water use efficiency.",
    brief_te: "'హర్ ఖేత్ కో పానీ' - ప్రతి పొలానికి నీరు. డ్రిప్ & స్ప్రింక్లర్ సూక్ష్మ సేద్యానికి చిన్న రైతులకు 55%, ఇతరులకు 45% సబ్సిడీ. నీటి వినియోగ సామర్థ్యంపై దృష్టి.",
    eligibility_en: "All farmers. Priority for drought-prone areas and small/marginal farmers.",
    eligibility_te: "అన్ని రైతులు. కరవు ప్రాంతాలు & చిన్న/సన్నకారు రైతులకు ప్రాధాన్యత.",
    benefit_en: "45-55% subsidy on micro-irrigation systems. Watershed development support.",
    benefit_te: "సూక్ష్మ సేద్య వ్యవస్థలపై 45-55% సబ్సిడీ. వాటర్‌షెడ్ అభివృద్ధి మద్దతు.",
    apply_link: "https://pmksy.gov.in",
    documents_en: "Land records, Water source details, Bank account, Aadhaar",
    documents_te: "భూమి రికార్డులు, నీటి వనరుల వివరాలు, బ్యాంక్ ఖాతా, ఆధార్",
    status: "active",
  },
  {
    id: "rythu-bandhu",
    name_en: "Rythu Bandhu (Telangana)",
    name_te: "రైతు బంధు (తెలంగాణ)",
    type: "ts",
    ministry: "Telangana State Government",
    brief_en: "Telangana's farmer investment support scheme providing ₹10,000 per acre per year (₹5,000 each for Kharif and Rabi seasons) directly to land-owning farmers for purchasing inputs like seeds, fertilizers, and pesticides.",
    brief_te: "తెలంగాణ రైతు పెట్టుబడి సహాయ పథకం - ఏడాదికి ఎకరాకు ₹10,000 (ఖరీఫ్ & రబీకి ₹5,000 చొప్పున) నేరుగా భూమి ఉన్న రైతులకు విత్తనాలు, ఎరువులు, పురుగు మందులు కొనడానికి.",
    eligibility_en: "All land-owning farmers in Telangana state",
    eligibility_te: "తెలంగాణ రాష్ట్రంలో భూమి ఉన్న అన్ని రైతులు",
    benefit_en: "₹10,000/acre/year (₹5,000 × 2 seasons) direct bank transfer",
    benefit_te: "₹10,000/ఎకరం/సంవత్సరం (₹5,000 × 2 సీజన్లు) నేరుగా బ్యాంక్ బదిలీ",
    apply_link: "https://rythubandhu.telangana.gov.in",
    documents_en: "Land passbook (Dharani), Aadhaar, Bank account",
    documents_te: "భూమి పాస్‌బుక్ (ధరణి), ఆధార్, బ్యాంక్ ఖాతా",
    status: "active",
  },
  {
    id: "ysr-rythu-bharosa",
    name_en: "YSR Rythu Bharosa (Andhra Pradesh)",
    name_te: "YSR రైతు భరోసా (ఆంధ్రప్రదేశ్)",
    type: "ap",
    ministry: "Andhra Pradesh State Government",
    brief_en: "AP's investment support scheme for farmers providing ₹13,500/year per farmer family. Includes PM-KISAN ₹6,000 + state's ₹7,500. Covers tenant farmers and landless agricultural laborers too.",
    brief_te: "AP రైతు కుటుంబానికి సంవత్సరానికి ₹13,500 పెట్టుబడి మద్దతు. PM-KISAN ₹6,000 + రాష్ట్ర ₹7,500 కలిపి. కౌలు రైతులు & భూమి లేని వ్యవసాయ కూలీలకు కూడా.",
    eligibility_en: "All farmer families in AP including tenant farmers and landless laborers",
    eligibility_te: "AP లోని అన్ని రైతు కుటుంబాలు - కౌలు రైతులు & భూమిలేని కూలీలు సహా",
    benefit_en: "₹13,500/year (PM-KISAN ₹6,000 + State ₹7,500) direct bank transfer",
    benefit_te: "₹13,500/సంవత్సరం (PM-KISAN ₹6,000 + రాష్ట్ర ₹7,500) నేరుగా బ్యాంక్ బదిలీ",
    apply_link: "https://ysrrythubharosa.ap.gov.in",
    documents_en: "Aadhaar, Land records/Tenant agreement, Bank account",
    documents_te: "ఆధార్, భూమి రికార్డులు/కౌలు ఒప్పందం, బ్యాంక్ ఖాతా",
    status: "active",
  },
  {
    id: "ap-crop-insurance",
    name_en: "YSR Free Crop Insurance (Andhra Pradesh)",
    name_te: "YSR ఉచిత పంట బీమా (ఆంధ్రప్రదేశ్)",
    type: "ap",
    ministry: "Andhra Pradesh State Government",
    brief_en: "AP government pays the farmer's premium share under PMFBY, making crop insurance completely free for AP farmers. Covers all notified crops against natural calamities.",
    brief_te: "PMFBY కింద రైతు ప్రీమియం వాటాను AP ప్రభుత్వం చెల్లిస్తుంది, AP రైతులకు పంట బీమా పూర్తిగా ఉచితం. ప్రకృతి విపత్తులపై అన్ని నోటిఫైడ్ పంటలకు.",
    eligibility_en: "All farmers in AP growing notified crops",
    eligibility_te: "AP లో నోటిఫైడ్ పంటలు పండించే అన్ని రైతులు",
    benefit_en: "100% premium paid by state government. Free crop insurance coverage.",
    benefit_te: "100% ప్రీమియం రాష్ట్ర ప్రభుత్వం చెల్లిస్తుంది. ఉచిత పంట బీమా.",
    apply_link: "https://www.apagrisnet.gov.in",
    documents_en: "Land records, Aadhaar, Bank account, Sowing certificate",
    documents_te: "భూమి రికార్డులు, ఆధార్, బ్యాంక్ ఖాతా, విత్తన ధృవీకరణ",
    status: "active",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { type, search } = body;

    let filtered = schemes;

    if (type && type !== "all") {
      filtered = filtered.filter((s) => s.type === type);
    }

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name_en.toLowerCase().includes(term) ||
          (s.name_te && s.name_te.includes(term)) ||
          s.brief_en.toLowerCase().includes(term)
      );
    }

    return new Response(JSON.stringify({ schemes: filtered, total: filtered.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Govt schemes error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
