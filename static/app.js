/**
 * Wheat Doctor — Wheat Crop Disease & Cultivar Diagnostic AI
 * Multi-Lingual Controller supporting 12 Indian Languages
 */

const INDIAN_LANGUAGES = [
  { code: 'hi', native: 'हिंदी', english: 'Hindi', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', flag: '🌾', speechCode: 'pa-IN' },
  { code: 'en', native: 'English', english: 'English', flag: '🇬🇧', speechCode: 'en-IN' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', flag: '🇮🇳', speechCode: 'mr-IN' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', flag: '🇮🇳', speechCode: 'bn-IN' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', flag: '🇮🇳', speechCode: 'gu-IN' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', flag: '🇮🇳', speechCode: 'te-IN' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', flag: '🇮🇳', speechCode: 'kn-IN' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam', flag: '🇮🇳', speechCode: 'ml-IN' },
  { code: 'ur', native: 'اردو', english: 'Urdu', flag: '🇮🇳', speechCode: 'ur-IN' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', flag: '🇮🇳', speechCode: 'or-IN' }
];

const i18n = {
  en: {
    appTitle: "Wheat Doctor",
    appSubtitle: "Wheat Crop AI 2.0",
    welcome: "Wheat Doctor (गेहूं डॉक्टर)",
    welcomeSub: "Specialized AI for Wheat Crops, Botanical Taxonomy & Rust Diagnostics",
    captureTitle: "Analyze Wheat Leaf Blade",
    captureSub: "Take a photo of the wheat leaf or test with calibrated wheat samples",
    varTitle: "🌾 Wheat Species & Cultivar Type",
    breadTitle: "Bread Wheat",
    breadTag: "Roti / Chapati",
    durumTitle: "Durum / Pasta",
    durumTag: "Suji / Semolina",
    emmerTitle: "Khapli / Emmer",
    emmerTag: "Ancient Grain",
    dropHeading: "Capture or Upload Wheat Leaf",
    dropSub: "JPG, PNG, WebP • Drag & drop supported",
    btnCamera: "Open Camera",
    btnGallery: "Upload from Gallery",
    samplesTitle: "🧪 1-Click Wheat Test Samples",
    samplesHint: "Tap any sample to test diagnosis",
    scanTitle: "Scanning Wheat Blade Morphology...",
    scanSub: "Classifying botanical family, cultivar & fungal rust spores",
    sevHeading: "Infection Severity",
    affectedArea: "Affected Surface Area:",
    voiceTitle: "Audio Diagnosis (Voice Assistant)",
    voiceIdle: "Tap play to listen to treatment",
    voicePlaying: "Reading diagnosis aloud...",
    tabSummary: "📋 Summary",
    tabChemical: "🧪 Chemical Spray",
    tabOrganic: "🍃 Organic",
    tabVarieties: "🌾 Resistant Varieties",
    tabPrevention: "🛡️ Prevention",
    btnScanAgain: "Scan Another Wheat Leaf",
    btnSaveReport: "Save / Print Diagnostic Report",
    lblTaxoGenus: "Genus & Tribe:",
    lblTaxoType: "Wheat Cultivar Type:",
    lblDosageTitle: "📏 Spray Dosage per Acre:",
    severityWords: {
      healthy: "Optimal Health",
      mild: "Mild (Early Stage)",
      moderate: "Moderate (Active Rust)",
      severe: "Severe (Critical Epidemic)"
    }
  },
  hi: {
    appTitle: "गेहूं डॉक्टर (Wheat Doctor)",
    appSubtitle: "गेहूं रोग व कुल निदान",
    welcome: "गेहूं डॉक्टर (Wheat Doctor AI)",
    welcomeSub: "गेहूं की फसल, वनस्पति कुल (पोएसी) और रतुआ रोग निदान प्रणाली",
    captureTitle: "गेहूं की पत्ती की जांच करें",
    captureSub: "पत्ती की फोटो खींचें या नीचे दिए गए गेहूं सैंपल से जांचें",
    varTitle: "🌾 गेहूं की प्रजाति व किस्म का चयन",
    breadTitle: "रोटी गेहूं (Bread)",
    breadTag: "रोटी / चपाती",
    durumTitle: "कठिया (Durum)",
    durumTag: "सूजी / पास्ता",
    emmerTitle: "खापली (Emmer)",
    emmerTag: "प्राचीन गेहूं",
    dropHeading: "गेहूं की पत्ती की फोटो लें या अपलोड करें",
    dropSub: "JPG, PNG, WebP • ड्रैग और ड्रॉप समर्थित",
    btnCamera: "कैमरा खोलें",
    btnGallery: "गैलरी से फोटो चुनें",
    samplesTitle: "🧪 1-क्लिक गेहूं टेस्ट सैंपल",
    samplesHint: "जांच देखने के लिए किसी भी पत्ती पर टैप करें",
    scanTitle: "गेहूं की पत्ती की एआई जांच जारी है...",
    scanSub: "वनस्पति कुल (ग्रेमिनी), किस्म और रतुआ फफूंद का विश्लेषण",
    sevHeading: "संक्रमण की गंभीरता",
    affectedArea: "प्रभावित पत्ती का क्षेत्रफल:",
    voiceTitle: "आवाज में रोग निदान",
    voiceIdle: "उपचार सुनने के लिए प्ले बटन दबाएं",
    voicePlaying: "उपचार पढ़कर सुनाया जा रहा है...",
    tabSummary: "📋 सारांश",
    tabChemical: "🧪 रासायनिक दवा",
    tabOrganic: "🍃 जैविक उपचार",
    tabVarieties: "🌾 रोगरोधी किस्में",
    tabPrevention: "🛡️ रोकथाम व सावधानी",
    btnScanAgain: "दूसरी गेहूं की पत्ती जांचें",
    btnSaveReport: "रिपोर्ट सेव / प्रिंट करें",
    lblTaxoGenus: "वंश व जनजाति (Genus):",
    lblTaxoType: "गेहूं का प्रकार व प्लॉइडी:",
    lblDosageTitle: "📏 दवा की मात्रा प्रति एकड़:",
    severityWords: {
      healthy: "उत्तम स्वास्थ्य",
      mild: "हल्का (शुरुआती अवस्था)",
      moderate: "मध्यम (सक्रिय रतुआ)",
      severe: "गंभीर (खतरनाक रतुआ)"
    }
  },
  pa: {
    appTitle: "ਕਣਕ ਡਾਕਟਰ (Wheat Doctor)",
    appSubtitle: "ਕਣਕ ਰੋਗ ਅਤੇ ਕੁੱਲ ਨਿਦਾਨ",
    welcome: "ਕਣਕ ਡਾਕਟਰ (Wheat Doctor AI)",
    welcomeSub: "ਕਣਕ ਦੀ ਫਸਲ, ਬਨਸਪਤੀ ਪਰਿਵਾਰ ਅਤੇ ਪੀਲੀ/ਭੂਰੀ ਕੁੰਗੀ ਦਾ ਨਿਦਾਨ",
    captureTitle: "ਕਣਕ ਦੇ ਪੱਤੇ ਦੀ ਜਾਂਚ ਕਰੋ",
    captureSub: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਵੋ ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਸੈਂਪਲ ਚੁਣੋ",
    varTitle: "🌾 ਕਣਕ ਦੀ ਕਿਸਮ ਤੇ ਪ੍ਰਜਾਤੀ ਦੀ ਚੋਣ",
    breadTitle: "ਆਮ ਕਣਕ (Bread)",
    breadTag: "ਰੋਟੀ / ਫੁਲਕਾ",
    durumTitle: "ਡੂਰਮ (Durum)",
    durumTag: "ਸੂਜੀ / ਸੇਵੀਆਂ",
    emmerTitle: "ਖਾਪਲੀ (Emmer)",
    emmerTag: "ਪੁਰਾਤਨ ਦਾਣਾ",
    dropHeading: "ਕਣਕ ਦੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਵੋ ਜਾਂ ਅਪਲੋਡ ਕਰੋ",
    dropSub: "JPG, PNG • ਡਰੈਗ ਅਤੇ ਡਰਾਪ",
    btnCamera: "ਕੈਮਰਾ ਖੋਲ੍ਹੋ",
    btnGallery: "ਗੈਲਰੀ ਵਿੱਚੋਂ ਚੁਣੋ",
    samplesTitle: "🧪 1-ਕਲਿੱਕ ਕਣਕ ਟੈਸਟ ਸੈਂਪਲ",
    samplesHint: "ਜਾਂਚ ਦੇਖਣ ਲਈ ਸੈਂਪਲ ਤੇ ਟੈਪ ਕਰੋ",
    scanTitle: "ਕਣਕ ਦੇ ਪੱਤੇ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...",
    scanSub: "ਪੀਲੀ ਕੁੰਗੀ ਅਤੇ ਉੱਲੀ ਦੇ ਰੋਗਾਣੂਆਂ ਦੀ ਪਛਾਣ ਜਾਰੀ",
    sevHeading: "ਰੋਗ ਦੀ ਗੰਭੀਰਤਾ",
    affectedArea: "ਅਸਰ-ਅਧੀਨ ਖੇਤਰਫਲ:",
    voiceTitle: "ਆਵਾਜ਼ ਵਿੱਚ ਇਲਾਜ",
    voiceIdle: "ਇਲਾਜ ਸੁਣਨ ਲਈ ਪਲੇਅ ਦਬਾਓ",
    voicePlaying: "ਇਲਾਜ ਸੁਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...",
    tabSummary: "📋 ਸਾਰੰਸ਼",
    tabChemical: "🧪 ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ",
    tabOrganic: "🍃 ਜੈਵਿਕ ਇਲਾਜ",
    tabVarieties: "🌾 ਬਿਮਾਰੀ-ਰੋਧਕ ਕਿਸਮਾਂ",
    tabPrevention: "🛡️ ਰੋਕਥਾਮ",
    btnScanAgain: "ਹੋਰ ਪੱਤਾ ਜਾਂਚੋ",
    btnSaveReport: "ਰਿਪੋਰਟ ਸੇਵ ਕਰੋ",
    lblTaxoGenus: "ਵੰਸ਼ (Genus):",
    lblTaxoType: "ਕਣਕ ਦੀ ਕਿਸਮ:",
    lblDosageTitle: "📏 ਸਪਰੇਅ ਦੀ ਖੁਰਾਕ ਪ੍ਰਤੀ ਏਕੜ:",
    severityWords: {
      healthy: "ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ",
      mild: "ਹਲਕਾ ਹਮਲਾ",
      moderate: "ਦਰਮਿਆਨਾ (ਸਰਗਰਮ ਕੁੰਗੀ)",
      severe: "ਗੰਭੀਰ ਹਮਲਾ"
    }
  },
  mr: {
    appTitle: "गहू डॉक्टर (Wheat Doctor)",
    appSubtitle: "गहू रोग व जात निदान",
    welcome: "गहू डॉक्टर (Wheat Doctor AI)",
    welcomeSub: "गहू पीक, वनस्पती कुल (पोएसी) आणि तांबेरा रोग निदान प्रणाली",
    captureTitle: "गव्हाच्या पानाची तपासणी करा",
    captureSub: "पानाचा फोटो काढा किंवा नमुन्यावरून तपासा",
    varTitle: "🌾 गव्हाची जात व प्रकार निवडा",
    breadTitle: "पोळी गहू (Bread)",
    breadTag: "चपाती / पोळी",
    durumTitle: "कठिया गहू (Durum)",
    durumTag: "रवा / सुजी",
    emmerTitle: "खापली गहू (Emmer)",
    emmerTag: "पौष्टिक / डायबिटीक",
    dropHeading: "गव्हाच्या पानाचा फोटो अपलोड करा",
    dropSub: "JPG, PNG • ड्रॅग आणि ड्रॉप समर्थित",
    btnCamera: "कॅमेरा उघडा",
    btnGallery: "गॅलरीतून निवडा",
    samplesTitle: "🧪 1-क्लिक गहू नमुने",
    samplesHint: "तपासणीसाठी नमुन्यावर टॅप करा",
    scanTitle: "गव्हाच्या पानाचे विश्लेषण सुरू आहे...",
    scanSub: "वनस्पती कुल (पोएसी) व तांबेरा बुरशीची ओळख",
    sevHeading: "रोगाची तीव्रता",
    affectedArea: "बाधित क्षेत्रफळ:",
    voiceTitle: "आवाजात सल्ला",
    voiceIdle: "उपचार ऐकण्यासाठी प्ले दाबा",
    voicePlaying: "उपचार वाचून दाखवला जात आहे...",
    tabSummary: "📋 सारांश",
    tabChemical: "🧪 रासायनिक फवारणी",
    tabOrganic: "🍃 सेंद्रिय उपाय",
    tabVarieties: "🌾 रोगप्रतिकारक वाण",
    tabPrevention: "🛡️ प्रतिबंधात्मक उपाय",
    btnScanAgain: "दुसरे पान तपासा",
    btnSaveReport: "अहवाल सेव्ह करा",
    lblTaxoGenus: "वंश (Genus):",
    lblTaxoType: "गव्हाचा प्रकार:",
    lblDosageTitle: "📏 फवारणी प्रमाण प्रति एकर:",
    severityWords: {
      healthy: "उत्कृष्ट आरोग्य",
      mild: "कमी संसर्ग",
      moderate: "मध्यम संसर्ग",
      severe: "तीव्र संसर्ग"
    }
  },
  bn: {
    appTitle: "গম ডাক্তার (Wheat Doctor)",
    appSubtitle: "গম রোগ ও ট্যাক্সোনমি নির্ণয়",
    welcome: "গম ডাক্তার (Wheat Doctor AI)",
    welcomeSub: "গম ফসল, পোয়েসি পরিবার এবং মরিচা রোগ সনাক্তকরণ",
    captureTitle: "গমের পাতা পরীক্ষা করুন",
    captureSub: "পাতার ছবি তুলুন বা নমুনা দিয়ে পরীক্ষা করুন",
    varTitle: "🌾 গমের প্রজাতি ও জাত নির্বাচন",
    breadTitle: "রুটি গম (Bread)",
    breadTag: "রুটি / চাপাতা",
    durumTitle: "ডুরুম গম (Durum)",
    durumTag: "সুজি / পাস্তা",
    emmerTitle: "খাপলি গম (Emmer)",
    emmerTag: "প্রাচীন খাদ্যশস্য",
    dropHeading: "গমের পাতার ছবি তুলুন বা আপলোড করুন",
    dropSub: "JPG, PNG • ড্র্যাগ ও ড্রপ",
    btnCamera: "ক্যামেরা খুলুন",
    btnGallery: "গ্যালারি থেকে নির্বাচন",
    samplesTitle: "🧪 ১-ক্লিক গম টেস্ট স্যাম্পল",
    samplesHint: "পরীক্ষা করতে স্যাম্পলে ট্যাপ করুন",
    scanTitle: "গমের পাতার এআই বিশ্লেষণ চলছে...",
    scanSub: "পোয়েসি পরিবার ও মরিচা রোগ সনাক্তকরণ",
    sevHeading: "সংক্রমণের তীব্রতা",
    affectedArea: "আক্রান্ত পাতার ক্ষেত্রফল:",
    voiceTitle: "ভয়েস প্রেসক্রিপশন",
    voiceIdle: "পরামর্শ শুনতে প্লে করুন",
    voicePlaying: "পরামর্শ পড়ে শোনানো হচ্ছে...",
    tabSummary: "📋 সারসংক্ষেপ",
    tabChemical: "🧪 রাসায়নিক স্প্রে",
    tabOrganic: "🍃 জৈব প্রতিকার",
    tabVarieties: "🌾 প্রতিরোধী জাত",
    tabPrevention: "🛡️ প্রতিরোধ",
    btnScanAgain: "অন্য পাতা পরীক্ষা করুন",
    btnSaveReport: "রিপোর্ট সংরক্ষণ করুন",
    lblTaxoGenus: "গণ (Genus):",
    lblTaxoType: "গমের ধরন:",
    lblDosageTitle: "📏 একর প্রতি স্প্রে ডোজ:",
    severityWords: {
      healthy: "সুস্থ গম পাতা",
      mild: "হালকা আক্রমণ",
      moderate: "মাঝারি আক্রমণ",
      severe: "মারাত্মক আক্রমণ"
    }
  },
  gu: {
    appTitle: "ઘઉં ડૉક્ટર (Wheat Doctor)",
    appSubtitle: "ઘઉં રોગ અને જાત નિદાન",
    welcome: "ઘઉં ડૉક્ટર (Wheat Doctor AI)",
    welcomeSub: "ઘઉંનો પાક, પોએસી કુળ અને ગેરુ રોગ નિદાન પ્રણાલી",
    captureTitle: "ઘઉંના પાનની તપાસ કરો",
    captureSub: "પાનનો ફોટો લો અથવા સેમ્પલ દ્વારા તપાસો",
    varTitle: "🌾 ઘઉંની જાત અને પ્રકાર પસંદ કરો",
    breadTitle: "રોટલી ઘઉં (Bread)",
    breadTag: "રોટલી / ભાખરી",
    durumTitle: "કાઠિયા ઘઉં (Durum)",
    durumTag: "સોજી / રવો",
    emmerTitle: "ખાપલી ઘઉં (Emmer)",
    emmerTag: "દેશી / ઔષધીય",
    dropHeading: "ઘઉંના પાનનો ફોટો અપલોડ કરો",
    dropSub: "JPG, PNG • ડ્રેગ અને ડ્રોપ",
    btnCamera: "કેમેરા ખોલો",
    btnGallery: "ગેલેરીમાંથી પસંદ કરો",
    samplesTitle: "🧪 1-ક્લિક ઘઉં સેમ્પલ",
    samplesHint: "ટેસ્ટ કરવા સેમ્પલ પર ટેપ કરો",
    scanTitle: "ઘઉંના પાનનું સ્કેનિંગ ચાલુ છે...",
    scanSub: "પોએસી કુળ અને ગેરુ ફૂગનું વિશ્લેષણ",
    sevHeading: "રોગની ગંભીરતા",
    affectedArea: "અસરગ્રસ્ત વિસ્તાર:",
    voiceTitle: "અવાજમાં માર્ગદર્શન",
    voiceIdle: "સાંભળવા પ્લે બટન દબાવો",
    voicePlaying: "ઉપચાર સંભળાવવામાં આવી રહ્યો છે...",
    tabSummary: "📋 સારાંશ",
    tabChemical: "🧪 રાસાયણિક દવા",
    tabOrganic: "🍃 દેશી ઉપચાર",
    tabVarieties: "🌾 રોગપ્રતિકારક જાતો",
    tabPrevention: "🛡️ સાવચેતી",
    btnScanAgain: "બીજું પાન તપાસો",
    btnSaveReport: "રિપોર્ટ સેવ કરો",
    lblTaxoGenus: "પ્રજાતિ (Genus):",
    lblTaxoType: "ઘઉંનો પ્રકાર:",
    lblDosageTitle: "📏 એકર દીઠ દવાનું પ્રમાણ:",
    severityWords: {
      healthy: "તંદુરસ્ત ઘઉં",
      mild: "હળવો ગેરુ",
      moderate: "મધ્યમ ગેરુ",
      severe: "ગંભીર ગેરુ"
    }
  },
  te: {
    appTitle: "గోధుమ డాక్టర్ (Wheat Doctor)",
    appSubtitle: "గోధుమ తెగులు & రకం నిర్ధారణ",
    welcome: "గోధుమ డాక్టర్ (Wheat Doctor AI)",
    welcomeSub: "గోధుమ పంట, పోయేసి కుటుంబం మరియు తుప్పు తెగులు నిర్ధారణ",
    captureTitle: "గోధుమ ఆకును విశ్లేషించండి",
    captureSub: "ఆకు ఫోటో తీయండి లేదా నమూనాను ఎంచుకోండి",
    varTitle: "🌾 గోధుమ రకం ఎంపిక",
    breadTitle: "రొట్టె గోధుమలు",
    breadTag: "రొట్టె / చపాతీ",
    durumTitle: "డ్యూరం / సుజి",
    durumTag: "రవ్వ / పాస్తా",
    emmerTitle: "ఖాప్లీ గోధుమలు",
    emmerTag: "పురాతన రకం",
    dropHeading: "గోధుమ ఆకు ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి",
    dropSub: "JPG, PNG • డ్రాగ్ & డ్రాప్",
    btnCamera: "కెమెరా తెరవండి",
    btnGallery: "గ్యాలరీ నుండి ఎంచుకోండి",
    samplesTitle: "🧪 1-క్లిక్ గోధుమ నమూనాలు",
    samplesHint: "నమూనాపై క్లిక్ చేసి పరీక్షించండి",
    scanTitle: "గోధుమ ఆకు స్కాన్ అవుతోంది...",
    scanSub: "కుటుంబం (పోయేసి) మరియు తెగులు విశ్లేషణ",
    sevHeading: "తెగులు తీవ్రత",
    affectedArea: "ప్రభావిత ప్రాంతం:",
    voiceTitle: "వాయిస్ సలహా",
    voiceIdle: "వినడానికి ప్లే నొక్కండి",
    voicePlaying: "సలహా వినిపించబడుతోంది...",
    tabSummary: "📋 సారాంశం",
    tabChemical: "🧪 రసాయన స్ప్రే",
    tabOrganic: "🍃 సేంద్రీయ నివారణ",
    tabVarieties: "🌾 రోగనిరోధక రకాలు",
    tabPrevention: "🛡️ నివారణ చర్యలు",
    btnScanAgain: "మరొక ఆకును పరీక్షించండి",
    btnSaveReport: "రిపోర్ట్ సేవ్ చేయండి",
    lblTaxoGenus: "ప్రజాతి (Genus):",
    lblTaxoType: "గోధుమ రకం:",
    lblDosageTitle: "📏 ఎకరానికి స్ప్రే మోతాదు:",
    severityWords: {
      healthy: "ఆరోగ్యకరమైన గోధుమ",
      mild: "స్వల్ప తెగులు",
      moderate: "మధ్యస్థ తెగులు",
      severe: "తీవ్రమైన తెగులు"
    }
  },
  ta: {
    appTitle: "கோதுமை டாக்டர் (Wheat Doctor)",
    appSubtitle: "கோதுமை நோய் & ரக கண்டறிதல்",
    welcome: "கோதுமை டாக்டர் (Wheat Doctor AI)",
    welcomeSub: "கோதுமை பயிர், போயேசி குடும்பம் மற்றும் துரு நோய் கண்டறிதல்",
    captureTitle: "கோதுமை இலையை சோதிக்கவும்",
    captureSub: "இலை படம் எடுக்கவும் அல்லது மாதிரியை தேர்வு செய்யவும்",
    varTitle: "🌾 கோதுமை ரகம் தேர்வு",
    breadTitle: "ரொட்டி கோதுமை",
    breadTag: "சப்பாத்தி",
    durumTitle: "டியூரம் / ரவை",
    durumTag: "ரவை / பாஸ்தா",
    emmerTitle: "சாம்பா கோதுமை",
    emmerTag: "பாரம்பரிய ரகம்",
    dropHeading: "கோதுமை இலையை பதிவேற்றவும்",
    dropSub: "JPG, PNG • படம் பதிவேற்றவும்",
    btnCamera: "கேமரா திறக்க",
    btnGallery: "கேலரியில் இருந்து தேர்வு",
    samplesTitle: "🧪 1-கிளிக் கோதுமை மாதிரிகள்",
    samplesHint: "மாதிரியை கிளிக் செய்து பார்க்கவும்",
    scanTitle: "கோதுமை இலை ஸ்கேன் செய்யப்படுகிறது...",
    scanSub: "போயேசி குடும்பம் மற்றும் துரு நோய் பகுப்பாய்வு",
    sevHeading: "நோயின் தீவிரம்",
    affectedArea: "பாதிக்கப்பட்ட பகுதி:",
    voiceTitle: "குரல் வழி சிகிச்சை",
    voiceIdle: "கேட்க பிளே அழுத்தவும்",
    voicePlaying: "சிகிச்சை வாசிக்கப்படுகிறது...",
    tabSummary: "📋 சுருக்கம்",
    tabChemical: "🧪 ரசாயன தெளிப்பு",
    tabOrganic: "🍃 இயற்கை முறை",
    tabVarieties: "🌾 எதிர்ப்பு ரகங்கள்",
    tabPrevention: "🛡️ தடுப்பு முறைகள்",
    btnScanAgain: "அடுத்த இலையை சோதிக்கவும்",
    btnSaveReport: "அறிக்கையை சேமிக்கவும்",
    lblTaxoGenus: "பேரினம் (Genus):",
    lblTaxoType: "கோதுமை வகை:",
    lblDosageTitle: "📏 ஏக்கருக்கு மருந்து அளவு:",
    severityWords: {
      healthy: "ஆரோக்கியமான கோதுமை",
      mild: "குறைந்த பாதிப்பு",
      moderate: "நடுத்தர பாதிப்பு",
      severe: "தீவிர பாதிப்பு"
    }
  },
  kn: {
    appTitle: "ಗೋಧಿ ಡಾಕ್ಟರ್ (Wheat Doctor)",
    appSubtitle: "ಗೋಧಿ ರೋಗ ಮತ್ತು ತಳಿ ವಿಶ್ಲೇಷಣೆ",
    welcome: "ಗೋಧಿ ಡಾಕ್ಟರ್ (Wheat Doctor AI)",
    welcomeSub: "ಗೋಧಿ ಬೆಳೆ, ಪೊಯೇಸೀ ಕುಟುಂಬ ಮತ್ತು ತುಕ್ಕು ರೋಗ ತಪಾಸಣೆ",
    captureTitle: "ಗೋಧಿ ಎಲೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ",
    captureSub: "ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಮಾದರಿ ಆಯ್ಕೆಮಾಡಿ",
    varTitle: "🌾 ಗೋಧಿ ತಳಿ ಆಯ್ಕೆ",
    breadTitle: "ರೊಟ್ಟಿ ಗೋಧಿ",
    breadTag: "ರೊಟ್ಟಿ / ಚಪಾತಿ",
    durumTitle: "ಡ್ಯುರಮ್ / ರವೆ",
    durumTag: "ರವೆ / ಸೂಜಿ",
    emmerTitle: "ಖಾಪ್ಲಿ ಗೋಧಿ",
    emmerTag: "ಪುರಾತನ ತಳಿ",
    dropHeading: "ಗೋಧಿ ಎಲೆ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    dropSub: "JPG, PNG • ಡ್ರ್ಯಾಗ್ & ಡ್ರಾಪ್",
    btnCamera: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ",
    btnGallery: "ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆ",
    samplesTitle: "🧪 1-ಕ್ಲಿಕ್ ಗೋಧಿ ಸ್ಯಾಂಪಲ್ಸ್",
    samplesHint: "ಪರೀಕ್ಷಿಸಲು ಸ್ಯಾಂಪಲ್ ಒತ್ತಿರಿ",
    scanTitle: "ಗೋಧಿ ಎಲೆ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...",
    scanSub: "ಪೊಯೇಸೀ ಕುಟುಂಬ ಮತ್ತು ರೋಗ ಪತ್ತೆ",
    sevHeading: "ರೋಗದ ತೀವ್ರತೆ",
    affectedArea: "ಬಾಧಿತ ವಿಸ್ತೀರ್ಣ:",
    voiceTitle: "ಧ್ವನಿ ಸಲಹೆ",
    voiceIdle: "ಕೇಳಲು ಪ್ಲೇ ಒತ್ತಿರಿ",
    voicePlaying: "ಸಲಹೆ ಓದಲಾಗುತ್ತಿದೆ...",
    tabSummary: "📋 ಸಾರಾಂಶ",
    tabChemical: "🧪 ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆ",
    tabOrganic: "🍃 ಸಾವಯವ ಪರಿಹಾರ",
    tabVarieties: "🌾 ರೋಗನಿರೋಧಕ ತಳಿಗಳು",
    tabPrevention: "🛡️ ತಡೆಗಟ್ಟುವಿಕೆ",
    btnScanAgain: "ಮತ್ತೊಂದು ಎಲೆ ಪರೀಕ್ಷಿಸಿ",
    btnSaveReport: "ವರದಿ ಉಳಿಸಿ",
    lblTaxoGenus: "ಕುಲ (Genus):",
    lblTaxoType: "ಗೋಧಿ ವಿಧ:",
    lblDosageTitle: "📏 ಎಕರೆಗೆ ಪ್ರಮಾಣ:",
    severityWords: {
      healthy: "ಆರೋಗ್ಯಕರ ಗೋಧಿ",
      mild: "ಕಡಿಮೆ ತೀವ್ರತೆ",
      moderate: "ಮಧ್ಯಮ ತೀವ್ರತೆ",
      severe: "ಹೆಚ್ಚಿನ ತೀವ್ರತೆ"
    }
  },
  ml: {
    appTitle: "ഗോതമ്പ് ഡോക്ടർ (Wheat Doctor)",
    appSubtitle: "ഗോതമ്പ് രോഗ നിർണ്ണയം",
    welcome: "ഗോതമ്പ് ഡോക്ടർ (Wheat Doctor AI)",
    welcomeSub: "ഗോതമ്പ് കൃഷി, പൊവേസി കുടുംബം, തുരുമ്പ് രോഗ നിർണ്ണയം",
    captureTitle: "ഗോതമ്പ് ഇല പരിശോധിക്കുക",
    captureSub: "ഫോട്ടോ എടുക്കുക അല്ലെങ്കിൽ സാമ്പിൾ തിരഞ്ഞെടുക്കുക",
    varTitle: "🌾 ഗോതമ്പ് ഇനം തിരഞ്ഞെടുക്കുക",
    breadTitle: "ബ്രെഡ് ഗോതമ്പ്",
    breadTag: "ചപ്പാത്തി",
    durumTitle: "ഡ്യൂറം / റവ",
    durumTag: "റവ / പാസ്ത",
    emmerTitle: "ഖാപ്ലി ഗോതമ്പ്",
    emmerTag: "പാരമ്പര്യ ഇനം",
    dropHeading: "ഗോതമ്പ് ഇല ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    dropSub: "JPG, PNG • ഡ്രാഗ് & ഡ്രോപ്പ്",
    btnCamera: "ക്യാമറ തുറക്കുക",
    btnGallery: "ഗാലറിയിൽ നിന്ന് തിരഞ്ഞെടുക്കുക",
    samplesTitle: "🧪 1-ക്ലിക്ക് സാമ്പിളുകൾ",
    samplesHint: "സാമ്പിളിൽ ക്ലിക്ക് ചെയ്യുക",
    scanTitle: "സ്കാനിംഗ് പുരോഗമിക്കുന്നു...",
    scanSub: "പൊവേസി കുടുംബവും രോഗനിർണ്ണയവും",
    sevHeading: "രോഗതീവ്രത",
    affectedArea: "ബാധിച്ച വിസ്തൃതി:",
    voiceTitle: "ശബ്ദ മാർഗ്ഗനിർദ്ദേശം",
    voiceIdle: "കേൾക്കാൻ പ്ലേ ചെയ്യുക",
    voicePlaying: "നിർദ്ദേശങ്ങൾ വായിക്കുന്നു...",
    tabSummary: "📋 സംഗ്രഹം",
    tabChemical: "🧪 കീടനാശിനി",
    tabOrganic: "🍃 ജൈവ രീതി",
    tabVarieties: "🌾 പ്രതിരോധ ഇനങ്ങൾ",
    tabPrevention: "🛡️ പ്രതിരോധം",
    btnScanAgain: "മറ്റൊരു ഇല പരിശോധിക്കുക",
    btnSaveReport: "റിപ്പോർട്ട് സൂക്ഷിക്കുക",
    lblTaxoGenus: "വംശം (Genus):",
    lblTaxoType: "ഗോതമ്പ് തരം:",
    lblDosageTitle: "📏 ഏക്കറിനുള്ള അളവ്:",
    severityWords: {
      healthy: "ആരോഗ്യമുള്ള ഗോതമ്പ്",
      mild: "നേരിയ തോതിൽ",
      moderate: "ഇടത്തരം",
      severe: "ഗുരുതരമായ അവസ്ഥ"
    }
  },
  ur: {
    appTitle: "گندم ڈاکٹر (Wheat Doctor)",
    appSubtitle: "گندم کی بیماری اور نسل کی تشخیص",
    welcome: "گندم ڈاکٹر (Wheat Doctor AI)",
    welcomeSub: "گندم کی فصل، پوئیسی خاندان اور کنگی بیماری کی تشخیص",
    captureTitle: "گندم کے پتے کا معائنہ کریں",
    captureSub: "پتے کی تصویر کھینچیں یا سیمپل منتخب کریں",
    varTitle: "🌾 گندم کی قسم اور نسل کا انتخاب",
    breadTitle: "روٹی گندم (Bread)",
    breadTag: "روٹی / چپاتی",
    durumTitle: "ڈیورم (Durum)",
    durumTag: "سوجی / پاستا",
    emmerTitle: "کھاپلی (Emmer)",
    emmerTag: "قدیم اناج",
    dropHeading: "گندم کے پتے کی تصویر اپلوڈ کریں",
    dropSub: "JPG, PNG • ڈریگ اور ڈراپ",
    btnCamera: "کیمرہ کھولیں",
    btnGallery: "گیلری سے منتخب کریں",
    samplesTitle: "🧪 1-کلک گندم کے نمونے",
    samplesHint: "ٹیسٹ کے لیے نمونے پر کلک کریں",
    scanTitle: "گندم کے پتے کی اسکیننگ جاری ہے...",
    scanSub: "پوئیسی خاندان اور فنگس کے جراثیم کی شناخت",
    sevHeading: "بیماری کی شدت",
    affectedArea: "متاثرہ رقبہ:",
    voiceTitle: "صوتی علاج",
    voiceIdle: "سننے کے لیے پلے دبائیں",
    voicePlaying: "علاج پڑھ کر سنایا جا رہا ہے...",
    tabSummary: "📋 خلاصہ",
    tabChemical: "🧪 کیمیائی اسپرے",
    tabOrganic: "🍃 نامیاتی علاج",
    tabVarieties: "🌾 مزاحمتی اقسام",
    tabPrevention: "🛡️ احتیاطی تدابیر",
    btnScanAgain: "دوسرا پتہ چیک کریں",
    btnSaveReport: "رپورٹ محفوظ کریں",
    lblTaxoGenus: "جنس (Genus):",
    lblTaxoType: "گندم کی قسم:",
    lblDosageTitle: "📏 اسپرے کی مقدار فی ایکڑ:",
    severityWords: {
      healthy: "صحت مند گندم",
      mild: "ہلکا حملہ",
      moderate: "درمیانہ حملہ",
      severe: "شدید حملہ"
    }
  },
  or: {
    appTitle: "ଗହମ ଡାକ୍ତର (Wheat Doctor)",
    appSubtitle: "ଗହମ ରୋଗ ଓ କିସମ ଚିହ୍ନଟ",
    welcome: "ଗହମ ଡାକ୍ତର (Wheat Doctor AI)",
    welcomeSub: "ଗହମ ଫସଲ, ପୋଏସି ପରିବାର ଓ କଳଙ୍କୀ ରୋଗ ନିଦାନ",
    captureTitle: "ଗହମ ପତ୍ର ପରୀକ୍ଷା କରନ୍ତୁ",
    captureSub: "ଫଟୋ ଉଠାନ୍ତୁ କିମ୍ବା ନମୁନା ବାଛନ୍ତୁ",
    varTitle: "🌾 ଗହମ କିସମ ଚୟନ",
    breadTitle: "ରୁଟି ଗହମ (Bread)",
    breadTag: "ରୁଟି / ଚପାତି",
    durumTitle: "ଡୁରମ ଗହମ (Durum)",
    durumTag: "ସୁଜି / ପାସ୍ତା",
    emmerTitle: "ଖାପଲି ଗହମ (Emmer)",
    emmerTag: "ପୁରାତନ ଶସ୍ୟ",
    dropHeading: "ଗହମ ପତ୍ର ଫଟୋ ଅପଲୋଡ କରନ୍ତୁ",
    dropSub: "JPG, PNG • ଡ୍ରାଗ ଏବଂ ଡ୍ରପ",
    btnCamera: "କ୍ୟାମେରା ଖୋଲନ୍ତୁ",
    btnGallery: "ଗ୍ୟାଲେରୀରୁ ବାଛନ୍ତୁ",
    samplesTitle: "🧪 ୧-କ୍ଲିକ ଗହମ ନମୁନା",
    samplesHint: "ପରୀକ୍ଷା ପାଇଁ ନମୁନା ଛୁଅନ୍ତୁ",
    scanTitle: "ଗହମ ପତ୍ର ସ୍କାନ ହେଉଛି...",
    scanSub: "ପୋଏସି କୁଳ ଓ ରୋଗ ବିଶ୍ଳେଷଣ",
    sevHeading: "ରୋଗର ତୀବ୍ରତା",
    affectedArea: "ଆକ୍ରାନ୍ତ ପରିମାଣ:",
    voiceTitle: "ଭଏସ ପରାମର୍ଶ",
    voiceIdle: "ଶୁଣିବା ପାଇଁ ପ୍ଲେ ଦବାନ୍ତୁ",
    voicePlaying: "ପରାମର୍ଶ ପଢାଯାଉଛି...",
    tabSummary: "📋 ସାରାଂଶ",
    tabChemical: "🧪 ରାସାୟନିକ ସ୍ପ୍ରେ",
    tabOrganic: "🍃 ଜୈବିକ ଉପଚାର",
    tabVarieties: "🌾 ରୋଗ ପ୍ରତିରୋଧକ କିସମ",
    tabPrevention: "🛡️ ନିରାକରଣ",
    btnScanAgain: "ଅନ୍ୟ ପତ୍ର ପରୀକ୍ଷା କରନ୍ତୁ",
    btnSaveReport: "ରିପୋର୍ଟ ସାଇତନ୍ତୁ",
    lblTaxoGenus: "ପ୍ରଜାତି (Genus):",
    lblTaxoType: "ଗହମ ପ୍ରକାର:",
    lblDosageTitle: "📏 ଏକର ପିଛା ମାତ୍ରା:",
    severityWords: {
      healthy: "ସୁସ୍ଥ ଗହମ",
      mild: "ସ୍ୱଳ୍ପ ରୋଗ",
      moderate: "ମଧ୍ୟମ ରୋଗ",
      severe: "ଗମ୍ଭୀର ରୋଗ"
    }
  }
};

const appState = {
  lang: 'hi',
  selectedWheatType: 'breadWheat',
  currentScreen: 'lang',
  currentImageBase64: null,
  currentResult: null,
  viewMode: 'raw',
  isSpeaking: false,
  webcamStream: null,
  cameraFacing: 'environment',
  scanHistory: []
};
window.appState = appState;

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  renderLanguageGrid();
  loadScanHistory();
  loadWheatSamples();
  setupDropzone();
  initSpeechSynthesis();
});

// ================= RENDER 12 INDIAN LANGUAGES GRID =================
function renderLanguageGrid() {
  const container = document.getElementById('lang-grid-container');
  container.innerHTML = '';
  INDIAN_LANGUAGES.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'indian-lang-btn' + (appState.lang === lang.code ? ' active' : '');
    btn.onclick = () => selectLanguage(lang.code);
    btn.innerHTML = `
      <span class="i-lang-flag">${lang.flag}</span>
      <div class="i-lang-info">
        <span class="i-lang-native">${lang.native}</span>
        <span class="i-lang-english">${lang.english}</span>
      </div>
    `;
    container.appendChild(btn);
  });
}

// ================= SCREEN NAVIGATION =================
function goToScreen(screenName) {
  appState.currentScreen = screenName;
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('screen-' + screenName);
  if (target) target.classList.add('active');

  const stepMap = { 'lang': 0, 'capture': 1, 'scan': 2, 'result': 3 };
  const stepIdx = stepMap[screenName] || 0;
  
  document.getElementById('dot-1').className = 'step-dot' + (stepIdx >= 1 ? ' active' : '');
  document.getElementById('dot-2').className = 'step-dot' + (stepIdx >= 2 ? ' active' : '');
  document.getElementById('dot-3').className = 'step-dot' + (stepIdx >= 3 ? ' active' : '');

  if (screenName !== 'capture' && appState.webcamStream) {
    stopCamera();
  }
}

// ================= LANGUAGE CONTROLS =================
function selectLanguage(langCode) {
  appState.lang = langCode;
  const langObj = INDIAN_LANGUAGES.find(l => l.code === langCode) || INDIAN_LANGUAGES[0];
  document.getElementById('current-lang-pill').textContent = langCode.toUpperCase();
  document.getElementById('current-lang-flag').textContent = langObj.flag;
  
  renderLanguageGrid();
  updateLanguageTexts();
  goToScreen('capture');
}

function updateLanguageTexts() {
  const t = i18n[appState.lang] || i18n['hi'] || i18n['en'];
  
  document.getElementById('nav-brand-title').textContent = t.appTitle;
  document.getElementById('nav-brand-sub').textContent = t.appSubtitle;
  document.getElementById('txt-lang-welcome').textContent = t.welcome;
  document.getElementById('txt-lang-sub').textContent = t.welcomeSub;
  document.getElementById('txt-capture-title').textContent = t.captureTitle;
  document.getElementById('txt-capture-sub').textContent = t.captureSub;
  document.getElementById('txt-drop-heading').textContent = t.dropHeading;
  document.getElementById('txt-drop-sub').textContent = t.dropSub;
  document.getElementById('txt-btn-camera').textContent = t.btnCamera;
  document.getElementById('txt-btn-gallery').textContent = t.btnGallery;
  document.getElementById('txt-samples-title').textContent = t.samplesTitle;
  document.getElementById('txt-samples-hint').textContent = t.samplesHint;
  if (t.varTitle) document.getElementById('txt-var-title').textContent = t.varTitle;
  if (t.breadTitle) document.getElementById('chip-main-bread').textContent = t.breadTitle;
  if (t.breadTag) document.getElementById('chip-tag-bread').textContent = t.breadTag;
  if (t.durumTitle) document.getElementById('chip-main-durum').textContent = t.durumTitle;
  if (t.durumTag) document.getElementById('chip-tag-durum').textContent = t.durumTag;
  if (t.emmerTitle) document.getElementById('chip-main-emmer').textContent = t.emmerTitle;
  if (t.emmerTag) document.getElementById('chip-tag-emmer').textContent = t.emmerTag;
  document.getElementById('scan-progress-text').textContent = t.scanTitle;
  document.getElementById('scan-step-detail').textContent = t.scanSub;
  document.getElementById('txt-sev-heading').textContent = t.sevHeading;
  document.getElementById('txt-affected-area-label').textContent = t.affectedArea;
  document.getElementById('txt-voice-title').textContent = t.voiceTitle;
  document.getElementById('txt-voice-status').textContent = t.voiceIdle;
  document.getElementById('tab-btn-summary').textContent = t.tabSummary;
  document.getElementById('tab-btn-chemical').textContent = t.tabChemical;
  document.getElementById('tab-btn-organic').textContent = t.tabOrganic;
  document.getElementById('tab-btn-varieties').textContent = t.tabVarieties;
  document.getElementById('tab-btn-prevention').textContent = t.tabPrevention;
  document.getElementById('txt-btn-scan-again').textContent = t.btnScanAgain;
  document.getElementById('txt-btn-save-report').textContent = t.btnSaveReport;
  document.getElementById('lbl-taxo-genus').textContent = t.lblTaxoGenus;
  document.getElementById('lbl-taxo-type').textContent = t.lblTaxoType;
  document.getElementById('lbl-dosage-title').textContent = t.lblDosageTitle;
}

// ================= WHEAT VARIETY SELECTION =================
function selectWheatType(typeKey, btn) {
  appState.selectedWheatType = typeKey;
  document.querySelectorAll('.var-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

// ================= SAMPLES LOADER =================
function renderSampleChips(samples) {
  const container = document.getElementById('samples-container');
  if (!container || !samples) return;
  container.innerHTML = '';
  samples.forEach(sample => {
    let title = sample.title;
    let badge = sample.badge;
    if (appState.lang === 'hi' && sample.title_hi) {
      title = sample.title_hi;
      badge = sample.badge_hi;
    } else if (appState.lang === 'pa' && sample.title_pa) {
      title = sample.title_pa;
      badge = sample.badge_pa;
    }
    const relPath = sample.path && sample.path.startsWith('/') ? sample.path.slice(1) : (sample.path || ('static/samples/' + sample.filename));
    const chip = document.createElement('div');
    chip.className = 'sample-chip';
    chip.onclick = () => testWithWheatSample(relPath, sample.wheatType);
    chip.innerHTML = `
      <img class="sample-thumb" src="${relPath}" alt="${title}" loading="lazy" crossorigin="anonymous">
      <div class="sample-chip-info">
        <span class="sample-chip-title">${title}</span>
        <span class="sample-chip-badge">${badge}</span>
      </div>
    `;
    container.appendChild(chip);
  });
}

async function loadWheatSamples() {
  if (window.location.protocol === 'file:' || window.location.hostname.endsWith('github.io')) {
    if (window.WHEAT_SAMPLES_LIST) {
      renderSampleChips(window.WHEAT_SAMPLES_LIST);
      return;
    }
  }
  try {
    const res = await fetch('/api/samples');
    const data = await res.json();
    if (data.status === 'success' && data.samples) {
      renderSampleChips(data.samples);
      return;
    }
  } catch (err) {
    console.warn('Using built-in offline wheat samples:', err);
  }
  if (window.WHEAT_SAMPLES_LIST) {
    renderSampleChips(window.WHEAT_SAMPLES_LIST);
  }
}

async function testWithWheatSample(imagePath, wheatType) {
  if (wheatType) {
    appState.selectedWheatType = wheatType;
  }
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      processWheatLeafImage(dataUrl);
    };
    img.onerror = async () => {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = (e) => processWheatLeafImage(e.target.result);
      reader.readAsDataURL(blob);
    };
    img.src = imagePath;
  } catch (err) {
    console.error('Failed to load wheat sample:', err);
  }
}

// ================= DRAG & DROP & FILE INPUTS =================
function triggerFileInput() {
  document.getElementById('galleryFileInput').click();
}

function setupDropzone() {
  const dropzone = document.getElementById('drop-zone');
  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  });
}

function handleFileSelected(evt) {
  const file = evt.target.files[0];
  if (file) handleFile(file);
  evt.target.value = '';
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid image file (JPG, PNG, or WebP).');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    processWheatLeafImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

// ================= LIVE WEBCAM CAMERA =================
async function startLiveCamera() {
  const container = document.getElementById('camera-container');
  const video = document.getElementById('webcam-video');
  const dropzone = document.getElementById('drop-zone');

  try {
    if (appState.webcamStream) {
      stopCamera();
    }
    const constraints = {
      video: {
        facingMode: appState.cameraFacing,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    appState.webcamStream = stream;
    video.srcObject = stream;
    dropzone.style.display = 'none';
    container.style.display = 'block';
  } catch (err) {
    console.warn('Live webcam fallback to input:', err);
    document.getElementById('cameraFileInput').click();
  }
}

function stopCamera() {
  if (appState.webcamStream) {
    appState.webcamStream.getTracks().forEach(track => track.stop());
    appState.webcamStream = null;
  }
  document.getElementById('camera-container').style.display = 'none';
  document.getElementById('drop-zone').style.display = 'block';
}

function switchCameraFacing() {
  appState.cameraFacing = (appState.cameraFacing === 'environment') ? 'user' : 'environment';
  startLiveCamera();
}

function captureLiveSnapshot() {
  const video = document.getElementById('webcam-video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  stopCamera();
  processWheatLeafImage(dataUrl);
}

// ================= IMAGE PROCESSING & ANALYSIS =================
async function processWheatLeafImage(dataUrl) {
  appState.currentImageBase64 = dataUrl;
  document.getElementById('scan-preview-img').src = dataUrl;
  goToScreen('scan');

  const progressFill = document.getElementById('scan-progress-fill');
  const stepText = document.getElementById('scan-step-detail');
  progressFill.style.width = '35%';

  const timer1 = setTimeout(() => {
    progressFill.style.width = '70%';
    stepText.textContent = appState.lang === 'pa' 
      ? 'ਪੀਲੀ ਕੁੰਗੀ ਦੀਆਂ ਧਾਰੀਆਂ ਅਤੇ ਉੱਲੀ ਦੇ ਰੋਗਾਣੂਆਂ ਦੀ ਪਛਾਣ ਜਾਰੀ...' 
      : (appState.lang === 'hi' ? 'पीले व भूरे रतुआ की धारियों व बीजाणुओं का विश्लेषण...' : 'Detecting parallel rust stripes & fungal spore pustules...');
  }, 400);

  const isStandaloneApp = window.location.protocol === 'file:' || window.location.hostname.endsWith('github.io');

  try {
    let result = null;
    if (isStandaloneApp && window.WheatVisionEngine) {
      result = await window.WheatVisionEngine.analyze(dataUrl, appState.selectedWheatType, appState.lang);
    } else {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          lang: appState.lang,
          wheat_type: appState.selectedWheatType
        })
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      result = await response.json();
    }

    clearTimeout(timer1);
    progressFill.style.width = '100%';

    if (result.status === 'error' || result.error_type === 'NOT_WHEAT_LEAF' || result.error_type === 'NON_PLANT' || result.is_wheat_leaf === false) {
      goToScreen('capture');
      showNotWheatModal(result);
      return;
    }

    if (result.status === 'success') {
      appState.currentResult = result;
      setTimeout(() => {
        renderResult(result);
        saveToScanHistory(result, dataUrl);
        goToScreen('result');
      }, 300);
    } else {
      goToScreen('capture');
      showNotWheatModal(result);
    }

  } catch (err) {
    console.warn('Activating On-Device WheatVisionEngine AI:', err);
    clearTimeout(timer1);
    progressFill.style.width = '100%';
    try {
      if (window.WheatVisionEngine) {
        const localResult = await window.WheatVisionEngine.analyze(dataUrl, appState.selectedWheatType, appState.lang);
        if (localResult.status === 'error' || localResult.is_wheat_leaf === false) {
          goToScreen('capture');
          showNotWheatModal(localResult);
          return;
        }
        appState.currentResult = localResult;
        setTimeout(() => {
          renderResult(localResult);
          saveToScanHistory(localResult, dataUrl);
          goToScreen('result');
        }, 300);
        return;
      }
    } catch (visionErr) {
      console.error('On-device vision error:', visionErr);
    }
    setTimeout(() => {
      const fallback = getFallbackWheatResult();
      appState.currentResult = fallback;
      renderResult(fallback);
      saveToScanHistory(fallback, dataUrl);
      goToScreen('result');
    }, 400);
  }
}

// ================= NON-WHEAT LEAF REJECTION MODAL =================
function showNotWheatModal(result) {
  const modal = document.getElementById('modal-not-wheat');
  if (!modal) return;

  const lang = appState.lang || 'hi';
  const titleEl = document.getElementById('not-wheat-modal-title');
  const subEl = document.getElementById('not-wheat-modal-sub');
  const msgEl = document.getElementById('not-wheat-modal-msg');
  const btnTextEl = document.getElementById('not-wheat-btn-text');

  const titles = {
    hi: "गेहूं की पत्ती नहीं है!",
    en: "Not a Wheat Leaf!",
    pa: "ਕਣਕ ਦਾ ਪੱਤਾ ਨਹੀਂ ਹੈ!",
    mr: "गव्हाचे पान नाही!",
    bn: "গমের পাতা নয়!",
    gu: "ઘઉંનું પાન નથી!",
    te: "గోధుమ ఆకు కాదు!",
    ta: "கோதுமை இலை அல்ல!",
    kn: "ಗೋಧಿ ಎಲೆ ಅಲ್ಲ!",
    ml: "ഗോതമ്പ് ഇലയല്ല!",
    ur: "گندم کا پتہ نہیں ہے!",
    or: "ଗହମ ପତ୍ର ନୁହେଁ!"
  };

  const subs = {
    hi: "अपलोड की गई फोटो गेहूं के पौधे की पत्ती नहीं है।",
    en: "The uploaded image is not of a wheat plant (Poaceae family).",
    pa: "ਅਪਲੋਡ ਕੀਤੀ ਫੋਟੋ ਕਣਕ ਦੇ ਪੌਦੇ ਦਾ ਪੱਤਾ ਨਹੀਂ ਹੈ।",
    mr: "अपलोड केलेला फोटो गव्हाच्या पिकाच्या पानाचा नाही.",
    bn: "আপলোড করা ছবিটি গম গাছের পাতা নয়।",
    gu: "અપલોડ કરેલ ફોટો ઘઉંના છોડના પાનનો નથી.",
    te: "అప్‌లోడ్ చేసిన చిత్రం గోధుమ మొక్క ఆకు కాదు.",
    ta: "பதிவேற்றப்பட்ட படம் கோதுமை பயிர் இலை அல்ல.",
    kn: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರವು ಗೋಧಿ ಬೆಳೆಯ ಎಲೆ ಅಲ್ಲ.",
    ml: "അപ്‌ലോഡ് ചെയ്ത ചിത്രം ഗോതമ്പ് ചെടിയുടെ ഇലയല്ല.",
    ur: "اپ لوڈ کردہ تصویر گندم کے پودے کا پتہ نہیں ہے۔",
    or: "ଅପଲୋଡ ହୋଇଥିବା ଫଟୋ ଗହମ ଗଛର ପତ୍ର ନୁହେଁ।"
  };

  const msgs = {
    hi: "गेहूं डॉक्टर विशेष रूप से गेहूं की फसल (रोटी, कठिया व खापली गेहूं) और रतुआ रोगों (पीला/भूरा रतुआ, चूर्णिल फफूंद, सेप्टोरिया) के सटीक निदान के लिए बनाया गया है। कृपया गेहूं की पत्ती की साफ फोटो अपलोड करें।",
    en: "Wheat Doctor is specialized exclusively for Wheat crops (Triticum aestivum, T. durum, T. dicoccum) and foliar rust diagnostics. Please upload a clear photo of a wheat leaf blade.",
    pa: "ਕਣਕ ਡਾਕਟਰ ਸਿਰਫ਼ ਕਣਕ ਦੀ ਫਸਲ (ਪੀਲੀ ਕੁੰਗੀ, ਭੂਰੀ ਕੁੰਗੀ ਆਦਿ) ਦੀ ਜਾਂਚ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕਣਕ ਦੇ ਪੱਤੇ ਦੀ ਸਾਫ਼ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।",
    mr: "गहू डॉक्टर केवळ गहू पिकाच्या (तांबेरा व बुरशी रोग) निदानासाठी बनवले गेले आहे. कृपया गव्हाच्या पानाचा स्पष्ट फोटो अपलोड करा.",
    bn: "গম ডাক্তার শুধুমাত্র গম ফসলের মরিচা ও পাতার রোগ নির্ণয়ের জন্য নিবেদিত। অনুগ্রহ করে গমের পাতার পরিষ্কার ছবি আপলোড করুন।",
    gu: "ઘઉં ડૉક્ટર ફક્ત ઘઉંના પાકના ગેરુ રોગના નિદાન માટે રચાયેલ છે. કૃપા કરીને ઘઉંના પાનનો સ્પષ્ટ ફોટો અપલોડ કરો.",
    te: "గోధుమ డాక్టర్ ప్రత్యేకంగా గోధుమ పంట తెగుళ్ల నిర్ధారణకు రూపొందించబడింది. దయచేసి గోధుమ ఆకు స్పష్టమైన ఫోટોను అప్‌లోڈ చేయండి.",
    ta: "கோதுமை டாக்டர் கோதுமை பயிர் துரு நோய்களைக் கண்டறிய மட்டுமே உருவாக்கப்பட்டது. தயவுசெய்து கோதுமை இலையின் தெளிவான படத்தை பதிவேற்றவும்.",
    kn: "ಗೋಧಿ ಡಾಕ್ಟರ್ ಕೇವಲ ಗೋಧಿ ಬೆಳೆಯ ರೋಗ ಪತ್ತೆಗೆ ಸೀಮಿತವಾಗಿದೆ. ದಯವಿಟ್ಟು ಗೋಧಿ ಎಲೆಯ ಸ್ಪಷ್ಟ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    ml: "ഗോതമ്പ് ഡോക്ടർ ഗോതമ്പ് വിളകളുടെ രോഗനിർണയത്തിനായി പ്രത്യേകം രൂപകൽപ്പന ചെയ്തതാണ്. ദയവായി ഗോതമ്പ് ഇലയുടെ ചിത്രം നൽകുക.",
    ur: "گندم ڈاکٹر خصوصی طور پر گندم کی فصل اور کنگی امراض کی تشخیص کے لیے ہے۔ براہ کرم گندم کے پتے کی صاف تصویر اپ لوڈ کریں۔",
    or: "ଗହମ ଡାକ୍ତର କେବଳ ଗହମ ଫସଲ ଓ ରୋଗ ନିଦାନ ପାଇଁ ଉଦ୍ଦିଷ୍ଟ। ଦୟାକରି ଗହମ ପତ୍ରର ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ କରନ୍ତୁ।"
  };

  const btnTexts = {
    hi: "गेहूं की पत्ती अपलोड करें",
    en: "Upload Wheat Leaf Blade",
    pa: "ਕਣਕ ਦਾ ਪੱਤਾ ਅਪਲੋਡ ਕਰੋ",
    mr: "गव्हाचे पान अपलोड करा",
    bn: "গমের পাতা আপলোড করুন",
    gu: "ઘઉંનું પાન અપલોડ કરો",
    te: "గోధుమ ఆకు అప్‌లోడ్ చేయండి",
    ta: "கோதுமை இலை பதிவேற்றவும்",
    kn: "ಗೋಧಿ ಎಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    ml: "ഗോതമ്പ് ഇല നൽകുക",
    ur: "گندم کا پتہ اپ لوڈ کریں",
    or: "ଗହମ ପତ୍ର ଅପଲୋଡ କରନ୍ତୁ"
  };

  if (titleEl) titleEl.textContent = titles[lang] || titles['hi'];
  if (subEl) subEl.textContent = subs[lang] || subs['hi'];
  if (msgEl) msgEl.textContent = (lang === 'hi' && result.message_hi) ? result.message_hi : (msgs[lang] || msgs['hi']);
  if (btnTextEl) btnTextEl.textContent = btnTexts[lang] || btnTexts['hi'];

  modal.style.display = 'flex';
}

function closeNotWheatModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('.modal-close-btn') && !e.target.closest('.btn-try-wheat')) return;
  const modal = document.getElementById('modal-not-wheat');
  if (modal) modal.style.display = 'none';
  goToScreen('capture');
}

// ================= RENDER RESULTS & BOTANICAL TAXONOMY =================
function renderResult(result) {
  try {
    const lang = appState.lang || 'hi';
    const t = i18n[lang] || i18n['hi'] || i18n['en'];

    // 1. Resolve Disease Data safely
    let diseaseData = null;
    if (result.diseaseData) {
      if (result.diseaseData[lang]) diseaseData = result.diseaseData[lang];
      else if (result.diseaseData['hi']) diseaseData = result.diseaseData['hi'];
      else if (result.diseaseData['en']) diseaseData = result.diseaseData['en'];
      else if (result.diseaseData.name) diseaseData = result.diseaseData;
    }
    if (!diseaseData) {
      diseaseData = {
        name: result.diseaseKey || 'Healthy Wheat Foliage',
        scientific: 'Triticum aestivum L.',
        status: 'Optimal Health',
        summary: 'Clean linear leaf blade with active chlorophyll distribution.',
        remedy: 'Maintain timely crown root irrigation (CRI stage). Keep field weed-free.',
        chemical: 'No chemical fungicide required.',
        dosage: 'Balanced NPK (120:60:40 kg/ha) with 25 kg ZnSO4.',
        organic: 'Apply bio-fertilizer Azotobacter / PSB culture with compost.',
        prevention: ['Sow certified varieties: DBW-187, DBW-303, HD-3086', 'Ensure optimum plant spacing']
      };
    }

    // 2. Botanical Family & Taxonomy Display
    const familyData = result.taxonomy?.family;
    let familyText = 'Poaceae (Gramineae) — True Grass Family';
    if (familyData) {
      if (typeof familyData === 'string') familyText = familyData;
      else familyText = familyData[lang] || familyData['hi'] || familyData['en'] || familyText;
    }
    const familyEl = document.getElementById('res-family-name');
    if (familyEl) familyEl.textContent = familyText;

    let cropName = 'Wheat (गेहूं)';
    if (result.taxonomy?.crop) {
      if (typeof result.taxonomy.crop === 'string') cropName = result.taxonomy.crop;
      else cropName = result.taxonomy.crop[lang] || result.taxonomy.crop['hi'] || cropName;
    }
    const cropEl = document.getElementById('res-crop-name');
    if (cropEl) cropEl.textContent = cropName;

    const identifiedType = result.taxonomy?.identifiedType;
    let typeName = 'Bread Wheat (Hexaploid, 6n=42)';
    if (identifiedType?.name) {
      if (typeof identifiedType.name === 'string') typeName = identifiedType.name;
      else typeName = identifiedType.name[lang] || identifiedType.name['hi'] || identifiedType.name['en'] || typeName;
    }
    const typeEl = document.getElementById('res-wheat-type-name');
    if (typeEl) typeEl.textContent = typeName;

    // Populate Recommended Resistant Varieties
    const varietiesList = document.getElementById('res-varieties-list');
    if (varietiesList) {
      varietiesList.innerHTML = '';
      const popVars = identifiedType?.popularVarieties || ['DBW-187 (Karan Vandana)', 'DBW-303', 'HD-3086', 'PBW-725', 'HD-3226'];
      popVars.forEach(v => {
        const span = document.createElement('span');
        span.className = 'var-tag';
        span.textContent = v;
        varietiesList.appendChild(span);
      });
    }

    // 3. Leaf Media & Heatmaps
    const leafImg = document.getElementById('res-leaf-image');
    if (leafImg && appState.currentImageBase64) {
      leafImg.src = appState.currentImageBase64;
    }
    const heatmapEl = document.getElementById('res-heatmap-overlay');
    if (heatmapEl && result.heatmapOverlayUrl) {
      heatmapEl.src = result.heatmapOverlayUrl;
    }
    setImageViewMode('raw');

    // 4. Titles & Scientific
    const titleEl = document.getElementById('res-disease-title');
    if (titleEl) titleEl.textContent = diseaseData.name || result.diseaseKey;
    const sciEl = document.getElementById('res-scientific-name');
    if (sciEl) sciEl.textContent = diseaseData.scientific || 'Triticum Pathogen';

    // 5. Health Badge & Confidence
    const healthPill = document.getElementById('res-health-pill');
    if (healthPill) healthPill.textContent = diseaseData.status || (result.diseaseKey === 'healthyWheat' ? 'Healthy Wheat' : 'Pathogen Detected');
    const confPill = document.getElementById('res-conf-pill');
    if (confPill) confPill.textContent = `${result.confidence || 96}% AI Confidence`;

    // 6. Severity Meter & Colors
    const mediaBox = document.querySelector('.result-image-box');
    const cursor = document.getElementById('res-meter-cursor');
    const sevWordEl = document.getElementById('res-severity-word');

    const sevColors = {
      healthy: '#16A34A',
      mild: '#84CC16',
      moderate: '#C27803',
      severe: '#DC2626'
    };
    const sevPositions = {
      healthy: '12%',
      mild: '37%',
      moderate: '62%',
      severe: '88%'
    };

    const currentSev = result.severity || 'healthy';
    if (mediaBox) mediaBox.style.borderColor = sevColors[currentSev] || '#16A34A';
    if (sevWordEl) {
      sevWordEl.textContent = (t.severityWords && t.severityWords[currentSev]) ? t.severityWords[currentSev] : currentSev;
      sevWordEl.style.color = sevColors[currentSev] || '#16A34A';
    }
    if (cursor) cursor.style.left = sevPositions[currentSev] || '12%';

    const affEl = document.getElementById('res-affected-pct');
    if (affEl) affEl.textContent = `${result.affectedPercentage || 0.0}%`;

    // 7. Tabs Content
    const remEl = document.getElementById('res-remedy-text');
    if (remEl) remEl.textContent = diseaseData.remedy || '—';
    const sumEl = document.getElementById('res-disease-summary');
    if (sumEl) sumEl.textContent = diseaseData.summary || '—';
    const chemEl = document.getElementById('res-chemical-text');
    if (chemEl) chemEl.textContent = diseaseData.chemical || '—';
    const dosEl = document.getElementById('res-dosage-text');
    if (dosEl) dosEl.textContent = diseaseData.dosage || '—';
    const orgEl = document.getElementById('res-organic-text');
    if (orgEl) orgEl.textContent = diseaseData.organic || '—';

    const prevList = document.getElementById('res-prevention-list');
    if (prevList) {
      prevList.innerHTML = '';
      const prevItems = Array.isArray(diseaseData.prevention) ? diseaseData.prevention : ['Sow certified disease-resistant varieties'];
      prevItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        prevList.appendChild(li);
      });
    }

    // 8. Speech Narration in Exact Chosen Indian Language
    const sevText = (t.severityWords && t.severityWords[currentSev]) ? t.severityWords[currentSev] : currentSev;
    
    // Strip Latin parentheticals for pure native regional speech
    const cleanCrop = (cropName || 'Wheat').replace(/\s*\([^)]*\)/g, '').trim();
    const cleanFamily = (familyText || 'Poaceae').replace(/\s*\([^)]*\)/g, '').trim();
    const cleanDisease = (diseaseData.name || '').replace(/\s*\([^)]*\)/g, '').trim();
    const cleanRemedy = (diseaseData.remedy || '').trim();
    
    const narration = `${cleanCrop}। ${cleanFamily}। ${cleanDisease}। ${t.sevHeading}: ${sevText}। ${cleanRemedy}`;
    appState.currentSpeechText = narration;
    speakNarration(narration, lang);

  } catch (err) {
    console.error('Error rendering results:', err);
    goToScreen('result');
  }
}

// ================= IMAGE VIEW MODE SWITCHER =================
function setImageViewMode(mode) {
  appState.viewMode = mode;
  const rawBtn = document.getElementById('btn-mode-raw');
  const heatBtn = document.getElementById('btn-mode-heatmap');
  const heatmapEl = document.getElementById('res-heatmap-overlay');

  if (mode === 'heatmap') {
    rawBtn.classList.remove('active');
    heatBtn.classList.add('active');
    heatmapEl.style.display = 'block';
  } else {
    rawBtn.classList.add('active');
    heatBtn.classList.remove('active');
    heatmapEl.style.display = 'none';
  }
}

// ================= TREATMENT TABS SWITCHER =================
function switchTreatmentTab(tabKey) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const btn = document.getElementById('tab-btn-' + tabKey);
  const pane = document.getElementById('pane-' + tabKey);
  if (btn) btn.classList.add('active');
  if (pane) pane.classList.add('active');
}

// ================= VOICE / TEXT-TO-SPEECH (TTS) IN ALL 12 INDIAN LANGUAGES =================
let cachedVoices = [];
let currentAudioInstance = null;
let speakCounter = 0;

function initSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

function stopAnyPlayingAudio() {
  if (window.AndroidTTS && typeof window.AndroidTTS.stop === 'function') {
    try { window.AndroidTTS.stop(); } catch (e) {}
  }
  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
    } catch(e) {}
    currentAudioInstance = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  setVoicePlayingUI(false);
}

function speakNarration(text, targetLang) {
  stopAnyPlayingAudio();
  const lang = targetLang || appState.lang || 'hi';
  const token = ++speakCounter;

  setVoicePlayingUI(true);

  // 0. If running inside Native Android APK with AndroidTTS Bridge
  if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
    try {
      const langObj = INDIAN_LANGUAGES.find(l => l.code === lang) || INDIAN_LANGUAGES[0];
      window.AndroidTTS.speak(text, langObj.speechCode || 'hi-IN');
      const estDurationMs = Math.max(3000, Math.min(25000, text.length * 85));
      setTimeout(() => {
        if (token === speakCounter) setVoicePlayingUI(false);
      }, estDurationMs);
      return;
    } catch (err) {
      console.warn('AndroidTTS bridge fallback:', err);
    }
  }

  // If running in standalone static mode (file:// or github.io), go straight to Web Speech API
  if (window.location.protocol === 'file:' || window.location.hostname.endsWith('github.io')) {
    fallbackBrowserSpeech(text, lang, token);
    return;
  }

  // 1. Try Server-Side Native Indian TTS Audio Stream (Guaranteed Malayalam, Bengali, Marathi, etc.)
  const ttsUrl = `/api/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(text)}`;
  const audio = new Audio();
  currentAudioInstance = audio;

  audio.onended = () => {
    if (token === speakCounter) {
      setVoicePlayingUI(false);
      currentAudioInstance = null;
    }
  };

  audio.onerror = (e) => {
    console.warn('Backend audio failed, switching to browser speech synthesis:', e);
    if (token === speakCounter) {
      fallbackBrowserSpeech(text, lang, token);
    }
  };

  audio.src = ttsUrl;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(err => {
      console.warn('Audio play prevented (user interaction required) or failed, using browser speech fallback:', err);
      if (token === speakCounter) {
        fallbackBrowserSpeech(text, lang, token);
      }
    });
  }
}

function fallbackBrowserSpeech(text, lang, token) {
  if (!('speechSynthesis' in window)) {
    setVoicePlayingUI(false);
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const langObj = INDIAN_LANGUAGES.find(l => l.code === lang) || INDIAN_LANGUAGES[0];
  const targetSpeechLang = langObj.speechCode || 'hi-IN';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetSpeechLang;
  utterance.rate = 0.92;

  const voices = cachedVoices.length ? cachedVoices : synth.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase() === targetSpeechLang.toLowerCase()) ||
                voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase())) ||
                voices.find(v => v.name.toLowerCase().includes(langObj.english.toLowerCase()));

  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    if (token === speakCounter) setVoicePlayingUI(false);
  };
  utterance.onerror = () => {
    if (token === speakCounter) setVoicePlayingUI(false);
  };

  synth.speak(utterance);
}

function toggleAudioSpeech() {
  if (appState.isSpeaking) {
    stopAnyPlayingAudio();
  } else if (appState.currentSpeechText) {
    speakNarration(appState.currentSpeechText, appState.lang);
  }
}

function setVoicePlayingUI(isPlaying) {
  appState.isSpeaking = isPlaying;
  const card = document.querySelector('.voice-assistant-card');
  const iconPlay = document.getElementById('voice-btn-icon-play');
  const iconPause = document.getElementById('voice-btn-icon-pause');
  const statusEl = document.getElementById('txt-voice-status');
  const t = i18n[appState.lang] || i18n['hi'] || i18n['en'];

  if (card && iconPlay && iconPause && statusEl) {
    if (isPlaying) {
      card.classList.add('playing');
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      statusEl.textContent = t.voicePlaying || 'Playing audio diagnosis...';
    } else {
      card.classList.remove('playing');
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      statusEl.textContent = t.voiceIdle || 'Tap play to listen in your language';
    }
  }
}

// ================= SCAN HISTORY (LOCALSTORAGE) =================
function saveToScanHistory(result, dataUrl) {
  try {
    const historyItem = {
      id: Date.now(),
      crop: 'Wheat (Triticum)',
      family: 'Poaceae',
      diseaseKey: result.diseaseKey,
      title: result.diseaseData[appState.lang]?.name || result.diseaseData['hi']?.name || result.diseaseKey,
      severity: result.severity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      imageThumb: dataUrl
    };
    appState.scanHistory.unshift(historyItem);
    if (appState.scanHistory.length > 20) appState.scanHistory.pop();
    localStorage.setItem('wheat_doctor_history', JSON.stringify(appState.scanHistory));
    renderHistoryList();
  } catch (e) {
    console.warn('Local storage error:', e);
  }
}

function loadScanHistory() {
  try {
    const saved = localStorage.getItem('wheat_doctor_history');
    if (saved) {
      appState.scanHistory = JSON.parse(saved);
      renderHistoryList();
    }
  } catch (e) {
    appState.scanHistory = [];
  }
}

function renderHistoryList() {
  const container = document.getElementById('history-list');
  if (!appState.scanHistory.length) {
    container.innerHTML = '<p class="history-empty">No past wheat scans yet. Scan a wheat leaf to save history.</p>';
    return;
  }
  container.innerHTML = '';
  appState.scanHistory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <img src="${item.imageThumb}" alt="Scan thumb">
      <div class="history-item-meta">
        <h4>${item.title}</h4>
        <p>Wheat • Poaceae • ${item.date} • ${item.severity.toUpperCase()}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function toggleHistoryDrawer() {
  document.getElementById('history-drawer').classList.toggle('open');
}

function clearScanHistory() {
  appState.scanHistory = [];
  localStorage.removeItem('wheat_doctor_history');
  renderHistoryList();
}

// ================= RESET & PRINT =================
function resetToScan() {
  if ('speechSynthesis' in window) {
    speakCounter++;
    window.speechSynthesis.cancel();
  }
  setVoicePlayingUI(false);
  appState.currentResult = null;
  appState.currentImageBase64 = null;
  goToScreen('capture');
}

function shareOrSaveReport() {
  window.print();
}

function getFallbackWheatResult() {
  return {
    crop: 'Wheat (Triticum)',
    taxonomy: {
      family: {
        hi: 'पोएसी / ग्रेमिनी (घास कुल)',
        en: 'Poaceae (Gramineae) — True Grass Family'
      },
      identifiedType: {
        name: {
          hi: 'सामान्य रोटी गेहूं (Triticum aestivum L.)',
          en: 'Common Bread Wheat (Triticum aestivum L.)'
        },
        popularVarieties: ['DBW-187', 'DBW-303', 'HD-3086', 'PBW-725']
      }
    },
    diseaseKey: 'stripeRust',
    severity: 'moderate',
    confidence: 96.5,
    affectedPercentage: 18.4,
    diseaseData: {
      hi: {
        name: 'पीला रतुआ / हल्दी रोग (Stripe Rust)',
        scientific: 'Puccinia striiformis',
        status: 'गंभीर फफूंद संक्रमण',
        summary: 'पत्तियों की नसों के समानांतर चमकीले पीले-नारंगी पाउडर की लंबी धारियां।',
        remedy: 'तुरंत प्रोपिकोनाज़ोल 25% EC (टिल्ट) 200 मिली प्रति 200 लीटर पानी प्रति एकड़ का छिड़काव करें।',
        chemical: 'प्रोपिकोनाज़ोल 25% EC (1 मिली/लीटर पानी)',
        dosage: '200 मिली दवा 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़कें।',
        organic: 'ट्राइकोडर्मा (5 ग्राम/लीटर) या खट्टी छाछ का छिड़काव करें।',
        prevention: ['रोगरोधी किस्में लगाएं: DBW-187, DBW-303, HD-3086', 'समय पर बुवाई करें']
      },
      en: {
        name: 'Yellow / Stripe Rust',
        scientific: 'Puccinia striiformis',
        status: 'Critical Foliar Threat',
        summary: 'Bright yellow to orange urediniospores forming distinct parallel linear stripes along leaf veins.',
        remedy: 'Immediately spray Propiconazole 25% EC (Tilt) @ 1 ml/L (200 ml in 200 L water/acre).',
        chemical: 'Propiconazole 25% EC @ 1 ml/L or Tebuconazole @ 1.25 ml/L',
        dosage: '200 ml in 200 Liters water per acre.',
        organic: 'Foliar spray of Trichoderma harzianum @ 5g/L.',
        prevention: ['Sow DBW-187, DBW-303, HD-3086', 'Avoid late sowing']
      }
    }
  };
}

// ================= MOBILE PHONE CONNECT & MULTI-NETWORK SHARING =================
let globalAppUrl = '';
let localAppUrl = `http://${window.location.hostname || '127.0.0.1'}:${window.location.port || '5000'}`;
let isPublicActive = false;
let currentModalTab = 'global';

async function initMobileConnect() {
  try {
    // Check if the current browser window is already visiting via a public URL / tunnel
    const currentOrigin = window.location.origin;
    const isPublicHost = window.location.protocol === 'https:' || 
      (!window.location.hostname.match(/^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/) && window.location.hostname.includes('.'));
    
    if (isPublicHost) {
      globalAppUrl = currentOrigin;
      isPublicActive = true;
    }

    const res = await fetch('/api/network-info');
    const data = await res.json();
    if (data.status === 'success') {
      if (data.local_url) {
        localAppUrl = data.local_url;
      }
      if (data.public_url) {
        globalAppUrl = data.public_url;
        isPublicActive = true;
      } else if (!globalAppUrl && isPublicHost) {
        globalAppUrl = currentOrigin;
        isPublicActive = true;
      }
    }
  } catch (e) {
    console.warn('[Network Info] Fallback to origin:', e);
  }
  updateNavGlobalIndicator();
}

function updateNavGlobalIndicator() {
  const dot = document.getElementById('nav-global-dot');
  const pill = document.getElementById('nav-share-pill');
  if (isPublicActive) {
    if (dot) dot.style.display = 'block';
    if (pill) pill.textContent = 'Share (Global)';
  } else {
    if (dot) dot.style.display = 'none';
    if (pill) pill.textContent = 'Share';
  }
}

function switchModalTab(tab) {
  currentModalTab = tab;
  const tabs = ['android', 'global', 'local'];
  tabs.forEach(tKey => {
    const tBtn = document.getElementById('tab-' + tKey);
    const tPane = document.getElementById('pane-' + tKey);
    if (tBtn) tBtn.classList.toggle('active', tKey === tab);
    if (tPane) tPane.classList.toggle('active', tKey === tab);
  });
}

function openInstallModal() {
  openMobileModal();
  switchModalTab('android');
}

let deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
});

async function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPwaPrompt = null;
    }
    return;
  }
  if (window.location.protocol === 'file:') {
    alert('✅ You are already running the Native Installed Android APK version of Wheat Doctor!');
    return;
  }
  alert('📲 To install Wheat Doctor on your Android Phone:\n\n1. Tap the Chrome menu (⋮) at the top-right corner of your screen and select "Add to Home screen" or "Install app".\n2. Or click "📥 Download Android .APK" below to download and install the native Android APK from GitHub Releases!');
}

function openMobileModal() {
  const modal = document.getElementById('mobile-modal');
  const globalInput = document.getElementById('global-url-input');
  const localInput = document.getElementById('local-url-input');
  const qrGlobal = document.getElementById('qr-code-img-global');
  const qrLocal = document.getElementById('qr-code-img-local');
  const liveBadge = document.getElementById('global-live-badge');
  const activateBox = document.getElementById('activate-tunnel-box');
  const globalBanner = document.getElementById('global-status-banner');
  const whatsappBtn = document.getElementById('whatsapp-share-btn');

  const effectiveGlobalUrl = globalAppUrl || window.location.origin;

  if (globalInput) globalInput.value = globalAppUrl || 'Generating global link...';
  if (localInput) localInput.value = localAppUrl;

  // Global QR Code
  if (qrGlobal && effectiveGlobalUrl) {
    qrGlobal.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(effectiveGlobalUrl)}&color=065f46&bgcolor=f8fafc`;
  }

  // Local QR Code
  if (qrLocal && localAppUrl) {
    qrLocal.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(localAppUrl)}&color=1e293b&bgcolor=f8fafc`;
  }

  // WhatsApp Share Link
  if (whatsappBtn && effectiveGlobalUrl) {
    const text = `🌾 Open Wheat Doctor AI on your phone:\n${effectiveGlobalUrl}\n(Scan leaves, detect rust diseases & get Hindi/Punjabi voice diagnosis!)`;
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  // Tunnel Active State in UI
  if (isPublicActive && globalAppUrl) {
    if (liveBadge) liveBadge.style.display = 'inline-block';
    if (activateBox) activateBox.style.display = 'none';
    if (globalBanner) globalBanner.style.display = 'flex';
  } else {
    if (liveBadge) liveBadge.style.display = 'none';
    if (activateBox) activateBox.style.display = 'block';
    if (globalBanner) globalBanner.style.display = 'none';
  }

  if (modal) modal.classList.add('open');
}

function closeMobileModal(e) {
  const modal = document.getElementById('mobile-modal');
  if (modal) modal.classList.remove('open');
}

function copyGlobalUrl() {
  const input = document.getElementById('global-url-input');
  if (input && input.value && !input.value.startsWith('Generating')) {
    navigator.clipboard.writeText(input.value).then(() => {
      alert('Global URL copied! Anyone on 4G/5G/any network can open this:\n\n' + input.value);
    }).catch(() => {
      alert('URL: ' + input.value);
    });
  } else {
    alert('Global link is still initializing or inactive. Click "Enable Global Internet Link" below.');
  }
}

function copyLocalUrl() {
  const input = document.getElementById('local-url-input');
  if (input) {
    navigator.clipboard.writeText(input.value).then(() => {
      alert('Local Wi-Fi URL copied (same Wi-Fi only):\n\n' + input.value);
    }).catch(() => {
      alert('URL: ' + input.value);
    });
  }
}

function openGlobalUrlInNewTab() {
  const url = globalAppUrl || (document.getElementById('global-url-input') ? document.getElementById('global-url-input').value : '');
  if (url && !url.startsWith('Generating')) {
    window.open(url, '_blank');
  } else {
    alert('Please enable the global link first.');
  }
}

async function activatePublicTunnel() {
  const activateBox = document.getElementById('activate-tunnel-box');
  const globalInput = document.getElementById('global-url-input');
  const qrGlobal = document.getElementById('qr-code-img-global');
  const liveBadge = document.getElementById('global-live-badge');
  const globalBanner = document.getElementById('global-status-banner');
  const whatsappBtn = document.getElementById('whatsapp-share-btn');

  if (activateBox) activateBox.innerHTML = '<p>⏳ Starting secure worldwide HTTPS tunnel... Please wait 5-10 seconds.</p>';

  try {
    const res = await fetch('/api/start-tunnel', { method: 'POST' });
    const data = await res.json();
    if (data.status === 'success' && data.public_url) {
      globalAppUrl = data.public_url;
      isPublicActive = true;
      if (globalInput) globalInput.value = globalAppUrl;
      if (qrGlobal) {
        qrGlobal.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(globalAppUrl)}&color=065f46&bgcolor=f8fafc`;
      }
      if (whatsappBtn) {
        const text = `🌾 Open Wheat Doctor AI on your phone:\n${globalAppUrl}\n(Scan leaves, detect rust diseases & get Hindi/Punjabi voice diagnosis!)`;
        whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      }
      if (liveBadge) liveBadge.style.display = 'inline-block';
      if (activateBox) activateBox.style.display = 'none';
      if (globalBanner) globalBanner.style.display = 'flex';
      updateNavGlobalIndicator();
      alert('🌍 Public Global Access is now LIVE!\n\nURL: ' + globalAppUrl + '\n\nAnyone on any network (4G/5G/Wi-Fi) can access it.');
    } else {
      if (activateBox) activateBox.innerHTML = '<p style="color:#DC2626;">Could not start tunnel automatically. Please launch using <b>start_online.bat</b> in the project folder.</p>';
    }
  } catch (e) {
    if (activateBox) activateBox.innerHTML = '<p style="color:#DC2626;">Error: ' + e.message + '</p>';
  }
}

// Auto fetch network info & register PWA Service Worker on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initMobileConnect();
  updateLanguageTexts();

  // Dynamically resolve GitHub repository APK link if hosted on GitHub Pages
  if (window.location.hostname.endsWith('.github.io')) {
    const owner = window.location.hostname.split('.')[0];
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const repo = pathParts[0] || 'Wheat-Doctor';
    const apkBtn = document.getElementById('github-apk-download-btn');
    const actBtn = document.getElementById('github-actions-btn');
    if (apkBtn) apkBtn.href = `https://github.com/${owner}/${repo}/releases/latest/download/Wheat-Doctor-v2.0-Android.apk`;
    if (actBtn) actBtn.href = `https://github.com/${owner}/${repo}/actions`;
  }

  // Register Offline Service Worker
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW registration skipped:', err));
  }
});

