/**
 * Wheat Doctor — Client-Side On-Device AI & Computer Vision Engine (vision_engine.js)
 * ===================================================================================
 * Exact JavaScript/HTML5 Canvas port of `model.py`:
 * 1. `rgbToHsv(r, g, b)` — Non-linear RGB to Hue-Saturation-Value transformation
 * 2. `computeFindEdges(rgba, w, h)` — 3x3 Laplacian High-Pass Edge Filter `[-1,-1,-1,-1,8,-1,-1,-1,-1]`
 * 3. `validateWheatLeafImage(imgElement)` — 120x120 Poaceae Monocot vs Broadleaf Dicot Validator:
 *    - 18-bin Sobel Directional Gradient Orientation Histogram (`peak_ratio`)
 *    - 1D Spatial Green-Channel Projection Variance Ratio (`profile_ratio`)
 *    - 6-Stage Non-Plant & Broadleaf Dicot Rejection Gates
 * 4. `analyze(imageSource, wheatType, lang)` — 220x220 Multi-Spectral Lesion Classifier &
 *    Gaussian-Blurred RGBA Heatmap Overlay Synthesizer.
 *
 * Works 100% offline inside the Native Android APK, Installed PWA, and GitHub Pages.
 */

window.WHEAT_TAXONOMY_DB = {
  "crop": {
    "en": "Wheat",
    "hi": "गेहूं (Wheat)",
    "pa": "ਕਣਕ (Wheat)",
    "mr": "गहू (Wheat)",
    "bn": "গম (Wheat)",
    "gu": "ઘઉં (Wheat)",
    "te": "గోధుమ (Wheat)",
    "ta": "கோதுமை (Wheat)",
    "kn": "ಗೋಧಿ (Wheat)",
    "ml": "ഗോതമ്പ് (Wheat)",
    "ur": "گندم (Wheat)",
    "or": "ଗହମ (Wheat)"
  },
  "family": {
    "scientific": "Poaceae (Gramineae)",
    "common": "Grass Family",
    "en": "Poaceae (Gramineae) — True Grass Family",
    "hi": "पोएसी / ग्रेमिनी (घास कुल)",
    "pa": "ਪੋਏਸੀ / ਗ੍ਰੈਮਿਨੀ (ਘਾਹ ਪਰਿਵਾਰ)",
    "mr": "पोएसी / ग्रॅमिनी (गवत कुल)",
    "bn": "পোয়েসি / গ্র্যামিনি (ঘাস পরিবার)",
    "gu": "પોએસી / ગ્રામિની (ઘાસ કુળ)",
    "te": "పోయేసి / గ్రామిని (గడ్డి కుటుంబం)",
    "ta": "போயேசி / புல் குடும்பம்",
    "kn": "ಪೊಯೇಸಿ (ಹುಲ್ಲು ಕುಟುಂಬ)",
    "ml": "പോയേസി (പുല്ല് കുടുംബം)",
    "ur": "پویسی / گھاس کا خاندان",
    "or": "ପୋଏସି (ଘାସ ପରିବାର)"
  },
  "subfamily": "Pooideae",
  "tribe": "Triticeae",
  "genus": "Triticum",
  "speciesTypes": {
    "breadWheat": {
      "scientific": "Triticum aestivum L.",
      "name": {
        "en": "Common Bread Wheat (Hexaploid, 2n=42)",
        "hi": "सामान्य रोटी गेहूं (हेक्साप्लॉइड - 6n)",
        "pa": "ਆਮ ਰੋਟੀ ਕਣਕ (ਹੈਕਸਾਪਲੋਇਡ)",
        "mr": "सामान्य चपाती गहू (हेक्साप्लॉइड)",
        "bn": "সাধারণ রুটি গম (হেক্সাপ্লয়েড)",
        "gu": "સામાન્ય રોટલી ઘઉં",
        "te": "సాధారణ రొట్టె గోధుమ",
        "ta": "சாதாரண ரொட்டி கோதுமை",
        "kn": "ಸಾಮಾನ್ಯ ರೊಟ್ಟಿ ಗೋಧಿ",
        "ml": "സാധാരണ റൊട്ടി ഗോതമ്പ്",
        "ur": "عام روٹی گندم",
        "or": "ସାଧାରଣ ରୁଟି ଗହମ"
      },
      "endUse": {
        "en": "Chapatis, Loaf Bread, Naan, Biscuits (87% of Indian production)",
        "hi": "रोटी, चपाती, नान, बिस्कुट (भारत में 87% उत्पादन)",
        "pa": "ਰੋਟੀਆਂ, ਫੁਲਕੇ, ਨਾਨ, ਬਿਸਕੁਟ (87% ਪੈਦਾਵਾਰ)",
        "mr": "चपाती, पोळी, पाव, बिस्किट"
      },
      "popularVarieties": [
        "DBW-187 (Karan Vandana)",
        "DBW-303 (Karan Vaishnavi)",
        "HD-3086 (Pusa Gautami)",
        "HD-2967",
        "PBW-725",
        "Sharbati MP"
      ]
    },
    "durumWheat": {
      "scientific": "Triticum durum Desf.",
      "name": {
        "en": "Durum / Pasta Wheat (Tetraploid, 2n=28)",
        "hi": "मालवी / पास्ता गेहूं (कठिया / सूजी गेहूं)",
        "pa": "ਡਿਊਰਮ / ਸੂਜੀ ਕਣਕ (ਟੈਟਰਾਪਲੋਇਡ)",
        "mr": "ड्युरम / रवा गहू (कठिया)",
        "bn": "ডুরম / সুজি গম",
        "gu": "દુરમ / ભાખરી-સુજી ઘઉં",
        "te": "డ్యూరమ్ / రవ్వ గోధుమ",
        "ta": "டுரம் / ரவை கோதுமை",
        "kn": "ಡ್ಯುರಮ್ / ರವೆ ಗೋಧಿ",
        "ml": "ഡ്യൂറം / റവ ഗോതമ്പ്",
        "ur": "ڈیورم / سوجی گندم",
        "or": "ଡ୍ୟୁରମ / ସୁଜି ଗହମ"
      },
      "endUse": {
        "en": "Semolina (Suji/Rava), Pasta, Macaroni, Dalia, Malwa Bati",
        "hi": "सूजी, रवा, पास्ता, मैकरोनी, दलिया, दाल-बाटी",
        "pa": "ਸੂਜੀ, ਰਵਾ, ਪਾਸਤਾ, ਦਲੀਆ",
        "mr": "रवा, पास्ता, दलिया, बाटी"
      },
      "popularVarieties": [
        "Malavshree (HI-8381)",
        "HI-8627 (Malav Kirti)",
        "Poshan (HI-8663)",
        "PDW-233",
        "UAS-428"
      ]
    },
    "emmerWheat": {
      "scientific": "Triticum dicoccum Schübl.",
      "name": {
        "en": "Emmer / Khapli Wheat (Tetraploid ancient grain)",
        "hi": "खपली / सांबा गेहूं (प्राचीन पौष्टिक गेहूं)",
        "pa": "ਖਪਲੀ ਕਣਕ (ਪੁਰਾਣੀ ਦੇਸੀ ਕਣਕ)",
        "mr": "खापली / जोड गहू (मधुमेह-हितैषी)",
        "bn": "খাপলি গম",
        "gu": "ખાપલી ઘઉં",
        "te": "ఖప్లీ గోధుమ",
        "ta": "சாம்பா / கப்ளி கோதுமை",
        "kn": "ಖಪ್ಲಿ ಗೋಧಿ",
        "ml": "ഖപ്ലി ഗോതമ്പ്",
        "ur": "کھپلی گندم",
        "or": "ଖାପଲି ଗହମ"
      },
      "endUse": {
        "en": "Dietary, Diabetes-friendly, High fiber, Traditional Khapli Roti & Upma",
        "hi": "मधुमेह-अनुकूल, उच्च फाइबर, पारंपरिक खापली खीर व उपमा",
        "pa": "ਸ਼ੂਗਰ-ਮਿੱਤਰ, ਉੱਚ ਫਾਈਬਰ, ਖਾਪਲੀ ਰੋਟੀ",
        "mr": "डायबेटिस-फ्रेंडली, उच्च फायबर, खापली लापशी व पोळी"
      },
      "popularVarieties": [
        "DDK-1029",
        "DDK-1009",
        "HW-1098 (Nilgiri Khapli)"
      ]
    }
  }
};

window.WHEAT_DISEASES_DATABASE = {
  "healthyWheat": {
    "id": "healthyWheat",
    "wheatTypeKey": "breadWheat",
    "en": {
      "name": "Healthy Wheat Foliage",
      "scientific": "Triticum aestivum — Optimal Health",
      "status": "Clean Chlorophyll • No Pathogen",
      "summary": "The wheat leaf blade exhibits uniform linear green chlorophyll distribution, active photosynthesis, and no rust pustules or fungal mycelium.",
      "organic": "Apply bio-fertilizer Azotobacter / PSB culture with compost. Spray 1% seaweed extract during tillering.",
      "chemical": "No chemical fungicide required. Maintain balanced NPK (120:60:40 kg/ha) with Zinc Sulfate (25 kg/ha).",
      "remedy": "Maintain optimum crown root irrigation (CRI stage) at 21 days after sowing. Keep field weed-free.",
      "prevention": [
        "First irrigation at Crown Root Initiation (CRI) 20-25 days after sowing.",
        "Maintain optimum plant canopy ventilation by line sowing at 20-22 cm row spacing.",
        "Monitor weekly during cool, dewy mornings for early yellow rust foci."
      ],
      "dosage": "Irrigation: 4-5 timely irrigations. NPK: 120:60:40 kg/ha with 25 kg ZnSO4."
    },
    "hi": {
      "name": "स्वस्थ गेहूं की पत्ती (Healthy Wheat)",
      "scientific": "ट्रिटिकम एस्टिवम (Triticum aestivum) — उत्तम स्वास्थ्य",
      "status": "स्वस्थ क्लोरोफिल • कोई रोग नहीं",
      "summary": "गेहूं की पत्ती पर क्लोरोफिल का गहरा हरा रंग और स्वस्थ समानांतर नसें हैं। कोई पीला रतुआ, भूरा रतुआ या फफूंद नहीं है।",
      "organic": "एज़ोटोबैक्टर व पीएसबी जैव उर्वरक का उपयोग करें। कल्ले फूटते समय 1% सीवीड अर्क का छिड़काव करें।",
      "chemical": "किसी फफूंदनाशक की आवश्यकता नहीं है। संतुलित खाद (120:60:40 NPK) और 25 किग्रा जिंक सल्फेट दें।",
      "remedy": "सीआरआई (CRI) अवस्था पर पहली सिंचाई करें। खेत को खरपतवार मुक्त रखें।",
      "prevention": [
        "बुवाई के 21 दिन बाद ताज मूल (CRI) अवस्था पर पहली हल्की सिंचाई करें।",
        "20-22 सेमी कतार से कतार दूरी पर बुवाई करें ताकि हवा का संचार बना रहे।",
        "दिसंबर-जनवरी में सुबह के समय पीले रतुआ के धब्बों की निगरानी करें।"
      ],
      "dosage": "सिंचाई: 4-5 क्रांतिक अवस्थाओं पर। खाद: 120:60:40 NPK + 25 किग्रा जिंक।"
    },
    "pa": {
      "name": "ਤੰਦਰੁਸਤ ਕਣਕ ਦਾ ਪੱਤਾ (Healthy Wheat)",
      "scientific": "Triticum aestivum — ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ",
      "status": "ਕੋਈ ਉੱਲੀ ਜਾਂ ਰਸਟ ਨਹੀਂ",
      "summary": "ਕਣਕ ਦੇ ਪੱਤੇ ਬਿਲਕੁਲ ਹਰੇ ਅਤੇ ਤੰਦਰੁਸਤ ਹਨ। ਕੋਈ ਪੀਲੀ ਕੁੰਗੀ ਜਾਂ ਭੂਰੀ ਕੁੰਗੀ ਦਾ ਹਮਲਾ ਨਹੀਂ ਹੈ।",
      "organic": "ਦੇਸੀ ਰੂੜੀ ਅਤੇ ਜੈਵਿਕ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
      "chemical": "ਕਿਸੇ ਉੱਲੀਨਾਸ਼ਕ ਸਪਰੇਅ ਦੀ ਲੋੜ ਨਹੀਂ। ਸੰਤੁਲਿਤ ਖਾਦ ਪਾਓ।",
      "remedy": "ਕੋਰ (ਪਹਿਲਾ ਪਾਣੀ) 21 ਦਿਨਾਂ ਬਾਅਦ ਲਗਾਓ ਅਤੇ ਨਦੀਨਾਂ ਦੀ ਰੋਕਥਾਮ ਕਰੋ।",
      "prevention": [
        "ਬਿਜਾਈ ਤੋਂ 20-25 ਦਿਨਾਂ ਬਾਅਦ ਪਹਿਲਾ ਪਾਣੀ ਲਾਓ।",
        "ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਕਿਸਮਾਂ (DBW-187, DBW-303, PBW-725) ਬੀਜੋ।"
      ],
      "dosage": "ਪਾਣੀ: ਸਮੇਂ ਸਿਰ 4-5 ਪਾਣੀ ਲਗਾਓ।"
    },
    "mr": {
      "name": "निरोगी गव्हाचे पान (Healthy Wheat)",
      "scientific": "Triticum aestivum — निरोगी पीक",
      "status": "कोणताही रोग नाही",
      "summary": "गव्हाच्या पानावर संपूर्ण हिरवेगार क्लोरोफिल आहे. तांबेरा किंवा भुरी रोगाची लक्षणे नाहीत.",
      "organic": "जीवामृत व ट्रायकोडर्माचा वापर करा.",
      "chemical": "रासायनिक बुरशीनाशकाची गरज नाही.",
      "remedy": "मुकुट मूळ फुटण्याच्या अवस्थेत (२१ दिवस) पाणी द्या.",
      "prevention": [
        "वेळेवर योग्य पाणी व्यवस्थापन करा."
      ]
    },
    "bn": {
      "name": "সুস্থ গমের পাতা (Healthy Wheat)",
      "scientific": "Triticum aestivum — রোগমুক্ত",
      "status": "উত্তম স্বাস্থ্য",
      "summary": "গমের পাতায় কোনো হলুদ মরিচা বা ব্লাইটের দাগ নেই।",
      "organic": "জৈব সার ও ট্রাইকোডার্মা ব্যবহার করুন।",
      "chemical": "কোনো ছত্রাকনাশক স্প্রে প্রয়োজন নেই।",
      "remedy": "বপনের ২১ দিন পর প্রথম সেচ প্রদান করুন।",
      "prevention": [
        "সঠিক সময়ে সেচ দিন ও আগাছা পরিষ্কার রাখুন।"
      ]
    },
    "gu": {
      "name": "તંદુરસ્ત ઘઉંનું પાન (Healthy Wheat)",
      "scientific": "Triticum aestivum — ઉત્તમ સ્વાસ્થ્ય",
      "status": "કોઈ રોગ નથી",
      "summary": "ઘઉંના પાંદડા સંપૂર્ણ સ્વસ્થ અને લીલાછમ છે.",
      "organic": "જીવામૃત અને લીમડાના અર્કનો ઉપયોગ કરો.",
      "chemical": "કોઈ ફૂગનાશકની જરૂર નથી.",
      "remedy": "૨૧ દિવસે પ્રથમ પિયત આપવું.",
      "prevention": [
        "યોગ્ય સમયે પિયત અને ખાતર વ્યવસ્થાપન રાખો."
      ]
    },
    "te": {
      "name": "ఆరోగ్యకరమైన గోధుమ ఆకు",
      "scientific": "Triticum aestivum — సంపూర్ణ ఆరోగ్యం",
      "status": "తెగులు లేని ఆకు",
      "summary": "గోధుమ ఆకుపై ఎటువంటి తుప్పు లేదా మచ్చ తెగులు లేదు.",
      "organic": "జీవామృతం ఉపయోగించండి.",
      "chemical": "ఎటువంటి రసాయన మందు అవసరం లేదు.",
      "remedy": "సమయానికి నీటి తడులు అందించండి.",
      "prevention": [
        "కలుపు నివారణ చర్యలు చేపట్టండి."
      ]
    },
    "ta": {
      "name": "ஆரோக்கியமான கோதுமை இலை",
      "scientific": "Triticum aestivum — நோய் அற்றது",
      "status": "பூஞ்சை தாக்குதல் இல்லை",
      "summary": "கோதுமை இலை பசுமையாகவும் ஆரோக்கியமாகவும் உள்ளது.",
      "organic": "இயற்கை உரம் பயன்படுத்தவும்.",
      "chemical": "பூஞ்சைக்கொல்லி தேவையில்லை.",
      "remedy": "சரியான பாசனம் மேற்கொள்ளவும்.",
      "prevention": [
        "களைகளை கட்டுப்படுத்தவும்."
      ]
    },
    "kn": {
      "name": "ಆರೋಗ್ಯಕರ ಗೋಧಿ ಎಲೆ",
      "scientific": "Triticum aestivum — ಉತ್ತಮ ಆರೋಗ್ಯ",
      "status": "ಯಾವುದೇ ರೋಗವಿಲ್ಲ",
      "summary": "ಗೋಧಿ ಎಲೆಯು ಸಂಪೂರ್ಣ ಹಸಿರಾಗಿದೆ ಮತ್ತು ರೋಗಮುಕ್ತವಾಗಿದೆ.",
      "organic": "ಜೀವಾಮೃತ ಬಳಸಿ.",
      "chemical": "ಯಾವುದೇ ಔಷಧಿ ಸಿಂಪಡಣೆ ಅಗತ್ಯವಿಲ್ಲ.",
      "remedy": "ಸಕಾಲಿಕ ನೀರಾವರಿ ಒದಗಿಸಿ.",
      "prevention": [
        "ಸರಿಯಾದ ಅಂತರದಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಿ."
      ]
    },
    "ml": {
      "name": "ആരോഗ്യമുള്ള ഗോതമ്പ് ഇല",
      "scientific": "Triticum aestivum — മികച്ച ആരോഗ്യം",
      "status": "രോഗബാധയില്ല",
      "summary": "ഇലയിൽ മഞ്ഞ തുരുമ്പോ മറ്റ് രോഗങ്ങളോ ഇല്ല.",
      "organic": "ജൈവവളങ്ങൾ ഉപയോഗിക്കുക.",
      "chemical": "കുമിൾനാശിനി ആവശ്യമില്ല.",
      "remedy": "കൃത്യസമയത്ത് ജലസേചനം നൽകുക.",
      "prevention": [
        "കളകൾ നിയന്ത്രിക്കുക."
      ]
    },
    "ur": {
      "name": "صحت مند گندم کا پتا (Healthy Wheat)",
      "scientific": "Triticum aestivum — مکمل صحت مند",
      "status": "کوئی بیماری نہیں",
      "summary": "گندم کے پتے پر کوئی پیلی یا بھوری کنگی کے نشانات نہیں ہیں۔",
      "organic": "گوبر کی کھاد اور بائیو فرٹیلائزر استعمال کریں۔",
      "chemical": "کسی کیمیائی اسپرے کی ضرورت نہیں۔",
      "remedy": "بوائی کے 21 دن بعد پہلا پانی لگائیں۔",
      "prevention": [
        "وقت پر آبپاشی اور جڑی بوٹیوں کا خاتمہ کریں۔"
      ]
    },
    "or": {
      "name": "ସୁସ୍ଥ ଗହମ ପତ୍ର (Healthy Wheat)",
      "scientific": "Triticum aestivum — ସମ୍ପୂର୍ଣ୍ଣ ସୁସ୍ଥ",
      "status": "କୌଣସି ରୋଗ ନାହିଁ",
      "summary": "ଗହମ ପତ୍ରରେ କୌଣସି କଳଙ୍କି ରୋଗର ଲକ୍ଷଣ ନାହିଁ।",
      "organic": "ଜୈବିକ ଖତ ବ୍ୟବହାର କରନ୍ତୁ।",
      "chemical": "ରାସାୟନିକ ଔଷଧର ଆବଶ୍ୟକତା ନାହିଁ।",
      "remedy": "ସମୟାନୁସାରେ ଜଳସେଚନ କରନ୍ତୁ।",
      "prevention": [
        "ଘାସ ନିୟନ୍ତ୍ରଣ କରନ୍ତୁ।"
      ]
    },
    "resistantVarieties": [
      {
        "name": "DBW-187 (Karan Vandana)",
        "region": "North Western & Eastern Plains",
        "features": "High yield, Biofortified, High rust resistance"
      },
      {
        "name": "DBW-303 (Karan Vaishnavi)",
        "region": "North Western Plains",
        "features": "Early sowing champion, resistant to yellow/brown rust"
      },
      {
        "name": "HD-3226 (Pusa Yashasvi)",
        "region": "NW Plains Zone",
        "features": "Highly resistant to stripe rust & Karnal bunt"
      }
    ]
  },
  "stripeRust": {
    "id": "stripeRust",
    "wheatTypeKey": "breadWheat",
    "en": {
      "name": "Yellow / Stripe Rust",
      "scientific": "Puccinia striiformis f. sp. tritici",
      "status": "Critical Foliar Epidemic Threat",
      "summary": "Bright yellow to orange urediniospores forming distinct parallel linear stripes along the wheat leaf veins, causing rapid chlorosis and yield loss up to 70%.",
      "organic": "Foliar spray of Trichoderma harzianum @ 5g/L or 5% Cow urine + Fermented Butter milk solution on initial spotting.",
      "chemical": "Spray Propiconazole 25% EC (Tilt) @ 1 ml/L (200 ml in 200 L water/acre) or Tebuconazole 25.9% EC @ 1.25 ml/L immediately.",
      "remedy": "Immediately spray Propiconazole 25% EC (Tilt) @ 1 ml/L. Repeat after 15 days if cool humid weather continues. Avoid excess nitrogen.",
      "prevention": [
        "Sow certified Stripe Rust resistant varieties: DBW-187 (Karan Vandana), DBW-303, HD-3086, HD-3226, PBW-725.",
        "Avoid late sowing in Northern Plains (complete sowing by Nov 15-25).",
        "Avoid flood irrigation during cold foggy spells; destroy initial yellow rust focus patches."
      ],
      "dosage": "Propiconazole 25% EC: 200 ml in 200 Liters of water per acre. Spray with flat fan nozzle."
    },
    "hi": {
      "name": "पीला रतुआ / हल्दी रोग (Stripe / Yellow Rust)",
      "scientific": "पक्सिनिया स्ट्राइफॉर्मिस (Puccinia striiformis)",
      "status": "गंभीर फफूंद संक्रमण — तुरंत छिड़काव करें",
      "summary": "पत्तियों की नसों के समानांतर चमकीले पीले-नारंगी पाउडर की लंबी धारियां बनती हैं। छूने पर हाथ पर पीली हल्दी जैसा पाउडर लग जाता है।",
      "organic": "शुरुआती अवस्था में ट्राइकोडर्मा हरजिएनम (5 ग्राम/लीटर) या 5% खट्टी छाछ + गोमूत्र का छिड़काव करें।",
      "chemical": "प्रोपिकोनाज़ोल 25% EC (टिल्ट / Tilt) 1 मिली प्रति लीटर पानी (200 मिली प्रति एकड़) या टेबुकोनाज़ोल का तुरंत छिड़काव करें।",
      "remedy": "तुरंत प्रोपिकोनाज़ोल 25% EC (टिल्ट) 200 मिली प्रति 200 लीटर पानी प्रति एकड़ का छिड़काव करें। 15 दिन बाद दोबारा दोहराएं।",
      "prevention": [
        "पीला रतुआ रोधी किस्में लगाएं: DBW-187 (करन वंदना), DBW-303, HD-3086, HD-3226, PBW-725।",
        "समय पर बुवाई करें (15 से 25 नवंबर के बीच)। देर से बुवाई में यह रोग ज्यादा लगता है।",
        "यूरिया (नाइट्रोजन) का अत्यधिक प्रयोग न करें, पोटाश की पर्याप्त मात्रा दें।"
      ],
      "dosage": "दवा: प्रोपिकोनाज़ोल 25% EC — 200 मिली दवा 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़कें।"
    },
    "pa": {
      "name": "ਪੀਲੀ ਕੁੰਗੀ / ਹਲਦੀ ਰੋਗ (Yellow / Stripe Rust)",
      "scientific": "Puccinia striiformis",
      "status": "ਗੰਭੀਰ ਖਤਰਾ — ਤੁਰੰਤ ਸਪਰੇਅ ਕਰੋ",
      "summary": "ਕਣਕ ਦੇ ਪੱਤਿਆਂ ਉੱਤੇ ਨਾੜੀਆਂ ਦੇ ਨਾਲ-ਨਾਲ ਪੀਲੇ ਰੰਗ ਦੀਆਂ ਧਾਰੀਆਂ ਬਣ ਜਾਂਦੀਆਂ ਹਨ। ਹੱਥ ਲਾਉਣ ਤੇ ਪੀਲਾ ਪਾਊਡਰ ਲੱਗਦਾ ਹੈ।",
      "organic": "ਸ਼ੁਰੂਆਤੀ ਧੱਬਿਆਂ ਤੇ ਲੱਸੀ ਅਤੇ ਗਊ-ਮੂਤਰ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
      "chemical": "ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% ਈਸੀ (ਟਿਲਟ/Tilt) 200 ਮਿ.ਲੀ. ਪ੍ਰਤੀ 200 ਲੀਟਰ ਪਾਣੀ ਪ੍ਰਤੀ ਏਕੜ ਤੁਰੰਤ ਛਿੜਕੋ।",
      "remedy": "ਟਿਲਟ (Tilt 25 EC) 200 ਮਿ.ਲੀ. ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ।",
      "prevention": [
        "ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਟਾਕਰਾ ਕਰਨ ਵਾਲੀਆਂ ਕਿਸਮਾਂ ਬੀਜੋ: DBW-187, DBW-303, PBW-725, HD-3086।",
        "ਨਵੰਬਰ ਦੇ ਪਹਿਲੇ ਪੰਦਰਵਾੜੇ ਬਿਜਾਈ ਮੁਕੰਮਲ ਕਰੋ।"
      ],
      "dosage": "ਖੁਰਾਕ: 200 ਮਿ.ਲੀ. ਟਿਲਟ 25 ਈ.ਸੀ. ਪ੍ਰਤੀ 200 ਲੀਟਰ ਪਾਣੀ ਪ੍ਰਤੀ ਏਕੜ।"
    },
    "mr": {
      "name": "पिवळा तांबेरा (Yellow Stripe Rust)",
      "scientific": "Puccinia striiformis",
      "status": "तातडीने फवारणी करा",
      "summary": "पानांवर शिरांच्या समांतर पिवळ्या रंगाच्या पट्ट्या तयार होतात. हाताला पिवळी भुकटी लागते.",
      "organic": "ताक आणि गोमूत्राची फवारणी करा.",
      "chemical": "प्रोपिकोनाझोल २५% ईसी (Tilt) १ मिली प्रति लिटर पाण्यात मिसळून फवारा.",
      "remedy": "प्रोपिकोनाझोल (Tilt) २०० मिली प्रति २०० लिटर पाण्यात मिसळून एकरी फवारा.",
      "prevention": [
        "तांबेरा प्रतिकारक वाण लावावेत: DBW-187, HD-3086."
      ]
    },
    "bn": {
      "name": "হলুদ মরিচা রোগ (Yellow Rust)",
      "scientific": "Puccinia striiformis",
      "status": "জরুরি ছত্রাকনাশক স্প্রে করুন",
      "summary": "পাতায় শিরা বরাবর লম্বা হলুদ রেখার মতো গুঁড়ো দাগ সৃষ্টি হয়।",
      "organic": "ট্রাইকোডার্মা স্প্রে করুন।",
      "chemical": "প্রপিকোনাজল ২৫% ইসি (১ মিলি/লিটার) স্প্রে করুন।",
      "remedy": "টিল্ট (Tilt 25 EC) ২০০ মিলি ২০০ লিটার পানিতে মিশিয়ে একর প্রতি স্প্রে করুন।",
      "prevention": [
        "রোগ প্রতিরোধী জাত চাষ করুন।"
      ]
    },
    "gu": {
      "name": "પીળો ગેરુ / હળદરિયો રોગ (Stripe Rust)",
      "scientific": "Puccinia striiformis",
      "status": "તાત્કાલિક છંટકાવ કરો",
      "summary": "પાંદડાની નસોની સમાંતર પીળા પાવડરની પટ્ટીઓ જોવા મળે છે.",
      "organic": "ખાટી છાશ અને ગૌમૂત્રનો છંટકાવ કરવો.",
      "chemical": "પ્રોપીકોનાઝોલ ૨૫% ઈસી (૧ મિલી/લિટર) છાંટવું.",
      "remedy": "પ્રોપીકોનાઝોલ ૨૦૦ મિલી પ્રતિ ૨૦૦ લિટર પાણીમાં એકરે છાંટવું.",
      "prevention": [
        "રોગપ્રતિકારક જાતો વાવવી."
      ]
    },
    "te": {
      "name": "పసుపు తుప్పు తెగులు (Yellow Stripe Rust)",
      "scientific": "Puccinia striiformis",
      "status": "తీవ్రమైన తెగులు",
      "summary": "గోధుమ ఆకులపై పొడవాటి పసుపు చారలు ఏర్పడతాయి.",
      "organic": "ట్రైకోడెర్మా పిచికారీ చేయండి.",
      "chemical": "ప్రోపికొనజోల్ 25% EC (1 మి.లీ./లీటర్) పిచికారీ చేయండి.",
      "remedy": "ఎకరాకు 200 మి.లీ. ప్రోపికొనజోల్ 200 లీటర్ల నీటిలో కలిపి పిచికారీ చేయండి.",
      "prevention": [
        "తెగులును తట్టుకునే రకాలను ఎంచుకోండి."
      ]
    },
    "ta": {
      "name": "மஞ்சள் துரு நோய் (Yellow Rust)",
      "scientific": "Puccinia striiformis",
      "status": "உடனடி பூஞ்சைக்கொல்லி தேவை",
      "summary": "இலையின் நரம்புகளுக்கு இணையாக மஞ்சள் நிற கோடுகள் உருவாகும்.",
      "organic": "டிரைக்கோடெர்மா தெளிக்கவும்.",
      "chemical": "புரோபிகோனசோல் (1 மி.லி./லிட்டர்) தெளிக்கவும்.",
      "remedy": "புரோபிகோனசோல் 25% EC ஏக்கருக்கு 200 மி.லி தெளிக்கவும்.",
      "prevention": [
        "நோய் எதிர்ப்பு ரகங்களை பயிரிடவும்."
      ]
    },
    "kn": {
      "name": "ಹಳದಿ ತುಕ್ಕು ರೋಗ (Yellow Stripe Rust)",
      "scientific": "Puccinia striiformis",
      "status": "ತಕ್ಷಣ ಔಷಧ ಸಿಂಪಡಿಸಿ",
      "summary": "ಎಲೆಗಳ ಮೇಲೆ ಹಳದಿ ಬಣ್ಣದ ಉದ್ದನೆಯ ಪಟ್ಟಿಗಳು ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.",
      "organic": "ಟ್ರೈಕೋಡರ್ಮಾ ಸಿಂಪಡಿಸಿ.",
      "chemical": "ಪ್ರೊಪಿಕೊನಜೋಲ್ 25% EC (1 ಮಿ.ಲೀ./ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.",
      "remedy": "ಎಕರೆಗೆ 200 ಮಿ.ಲೀ. ಪ್ರೊಪಿಕೊನಜೋಲ್ ಸಿಂಪಡಿಸಿ.",
      "prevention": [
        "ರೋಗ ನಿರೋಧಕ ತಳಿಗಳನ್ನು ಬಿತ್ತನೆ ಮಾಡಿ."
      ]
    },
    "ml": {
      "name": "മഞ്ഞ തുരുമ്പ് രോഗം (Yellow Rust)",
      "scientific": "Puccinia striiformis",
      "status": "ഉടൻ മരുന്ന് തളിക്കുക",
      "summary": "ഇലകളിൽ സമാന്തരമായി മഞ്ഞ വരകൾ കാണപ്പെടുന്നു.",
      "organic": "ട്രൈക്കോഡെർമ തളിക്കുക.",
      "chemical": "പ്രൊപ്പിക്കോനാസോൾ (1 മി.ലി/ലിറ്റർ) തളിക്കുക.",
      "remedy": "ഏക്കറിന് 200 മി.ലി പ്രൊപ്പിക്കോനാസോൾ തളിക്കുക.",
      "prevention": [
        "പ്രതിരോധ ശേഷിയുള്ള വിത്തുകൾ ഉപയോഗിക്കുക."
      ]
    },
    "ur": {
      "name": "پیلی کنگی / زرد کنگی (Yellow Stripe Rust)",
      "scientific": "Puccinia striiformis",
      "status": "فوری اسپرے کی ضرورت",
      "summary": "گندم کے پتوں پر رگوں کے ساتھ پیلی لکیریں بن جاتی ہیں اور ہاتھ پر پیلا سفوف لگتا ہے۔",
      "organic": "کھٹی لسی اور نیم کے عرق کا اسپرے کریں۔",
      "chemical": "پروپیکونازول (Tilt) 200 ملی لیٹر فی ایکڑ اسپرے کریں۔",
      "remedy": "پروپیکونازول 25% ای سی 200 ملی لیٹر فی 200 لیٹر پانی فی ایکڑ اسپرے کریں۔",
      "prevention": [
        "بیماری کے خلاف قوت مدافعت والی اقسام کاشت کریں۔"
      ]
    },
    "or": {
      "name": "ହଳଦିଆ କଳଙ୍କି ରୋଗ (Yellow Rust)",
      "scientific": "Puccinia striiformis",
      "status": "ତୁରନ୍ତ ଔଷଧ ସିଞ୍ଚନ କରନ୍ତୁ",
      "summary": "ପତ୍ରରେ ସମାନ୍ତରାଳ ଭାବରେ ହଳଦିଆ ଗୁଣ୍ଡ ଦାଗ ଦେଖାଯାଏ।",
      "organic": "ଟ୍ରାଇକୋଡର୍ମା ସିଞ୍ଚନ କରନ୍ତୁ।",
      "chemical": "ପ୍ରୋପିକୋନାଜୋଲ (୧ ମି.ଲି./ଲିଟର) ସିଞ୍ଚନ କରନ୍ତୁ।",
      "remedy": "ଏକର ପ୍ରତି ୨୦୦ ମି.ଲି. ପ୍ରୋପିକୋନାଜୋଲ ସିଞ୍ଚନ କରନ୍ତୁ।",
      "prevention": [
        "ରୋଗ ପ୍ରତିରୋଧକ କିସମ ଚାଷ କରନ୍ତୁ।"
      ]
    },
    "resistantVarieties": [
      {
        "name": "DBW-187 (Karan Vandana)",
        "region": "North Western & Eastern Zones",
        "features": "Stripe & Leaf Rust Resistant"
      },
      {
        "name": "PBW-725",
        "region": "Punjab & Haryana",
        "features": "High resistance against Yellow Rust virulent pathotypes"
      },
      {
        "name": "HD-3226 (Pusa Yashasvi)",
        "region": "NW Plains",
        "features": "Dual rust immune & heat tolerant"
      },
      {
        "name": "DBW-222 (Karan Narendra)",
        "region": "North-West Plains",
        "features": "Robust tillering and rust escape"
      }
    ]
  },
  "leafRust": {
    "id": "leafRust",
    "wheatTypeKey": "breadWheat",
    "en": {
      "name": "Brown / Leaf Rust",
      "scientific": "Puccinia triticina",
      "status": "Foliar Rust Attack",
      "summary": "Small circular to oval orange-brown/reddish-brown pustules scattered randomly across the upper leaf blade surface without forming stripes.",
      "organic": "Foliar spray of 5% Neem seed kernel extract (NSKE) or bio-fungicide Bacillus subtilis.",
      "chemical": "Spray Mancozeb 75% WP @ 2 g/L (600-800g/acre) or Propiconazole 25% EC @ 1 ml/L.",
      "remedy": "Apply Mancozeb 75% WP @ 2g/L or Propiconazole 25% EC @ 1ml/L at the first appearance of brown pustules.",
      "prevention": [
        "Grow resistant varieties: HD-3086, DBW-187, WH-1105, PBW-550.",
        "Avoid excessive late nitrogen application which favors rust spore multiplication."
      ],
      "dosage": "Mancozeb 75% WP: 600g to 800g per 200 Liters of water per acre."
    },
    "hi": {
      "name": "भूरा रतुआ / पत्ती का रतुआ (Brown / Leaf Rust)",
      "scientific": "पक्सिनिया ट्रिटिसिना (Puccinia triticina)",
      "status": "भूरे धब्बेदार फफूंद का हमला",
      "summary": "पत्ती की ऊपरी सतह पर गोल या अंडाकार भूरे-कतई रंग के बिखरे हुए दानेदार फफोले (पस्ट्यूल्स) बनते हैं। यह धारियों में नहीं होते।",
      "organic": "नीम के बीज का अर्क (5% NSKE) या खट्टी छाछ का छिड़काव करें।",
      "chemical": "मैंकोज़ेब 75% WP (2 ग्राम प्रति लीटर पानी) या प्रोपिकोनाज़ोल 25% EC (1 मिली/लीटर) का छिड़काव करें।",
      "remedy": "मैंकोज़ेब 75% WP 600-800 ग्राम प्रति एकड़ या टिल्ट 200 मिली प्रति एकड़ का छिड़काव करें।",
      "prevention": [
        "भूरा रतुआ रोधी किस्में लगाएं (HD-3086, DBW-187, PBW-725)।",
        "बालियां निकलते समय अत्यधिक नाइट्रोजन देने से बचें।"
      ],
      "dosage": "मैंकोज़ेब 75% WP: 600-800 ग्राम दवा 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़कें।"
    },
    "pa": {
      "name": "ਭੂਰੀ ਕੁੰਗੀ (Brown / Leaf Rust)",
      "scientific": "Puccinia triticina",
      "status": "ਭੂਰੀ ਉੱਲੀ ਦਾ ਹਮਲਾ",
      "summary": "ਪੱਤਿਆਂ ਤੇ ਗੋਲ ਅੰਡਾਕਾਰ ਭੂਰੇ ਰੰਗ ਦੇ ਧੱਬੇ ਬਣਦੇ ਹਨ।",
      "organic": "ਨੀਮ ਦੇ ਤੇਲ ਜਾਂ ਅਰਕ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
      "chemical": "ਮੈਂਕੋਜ਼ੇਬ 75% WP (2 ਗ੍ਰਾਮ/ਲੀਟਰ) ਜਾਂ ਟਿਲਟ 25% ਈਸੀ (1 ਮਿਲੀ/ਲੀਟਰ) ਛਿੜਕੋ।",
      "remedy": "ਮੈਂਕੋਜ਼ੇਬ 600-800 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਸਪਰੇਅ ਕਰੋ।",
      "prevention": [
        "ਰੋਧਕ ਕਿਸਮਾਂ ਦੀ ਬਿਜਾਈ ਕਰੋ।"
      ]
    },
    "mr": {
      "name": "तांबडा / भुरा तांबेरा (Brown Leaf Rust)",
      "scientific": "Puccinia triticina",
      "status": "बुरशीनाशक फवारा",
      "summary": "पानावर विखुरलेले गोलाकार तांबूस तपकिरी ठिपके दिसतात.",
      "organic": "५% निंबोळी अर्काची फवारणी करा.",
      "chemical": "मॅन्कोझेब ७५% डब्ल्यूपी (२ ग्रॅम/लिटर) फवारा.",
      "remedy": "मॅन्कोझेब ६००-८०० ग्रॅम एकरी फवारा."
    },
    "bn": {
      "name": "বাদামী মরিচা রোগ (Brown Rust)",
      "scientific": "Puccinia triticina",
      "status": "ছত্রাক আক্রমণ",
      "summary": "পাতায় ছোট গোলাকার বাদামী রঙের ফোসকার মতো দাগ দেখা যায়।",
      "organic": "নিম তেল স্প্রে করুন।",
      "chemical": "ম্যানকোজেব ৭৫% ডব্লিউপি (২ গ্রাম/লিটার) স্প্রে করুন।",
      "remedy": "ম্যানকোজেব বা প্রপিকোনাজল স্প্রে করুন।"
    },
    "gu": {
      "name": "કથ્થઈ ગેરુ રોગ (Brown Rust)",
      "scientific": "Puccinia triticina",
      "status": "ફૂગનો ઉપદ્રવ",
      "summary": "પાંદડા પર ગોળાકાર કથ્થઈ રંગના છૂટાછવાયા ડાઘા પડે છે.",
      "organic": "લીમડાના તેલનો છંટકાવ કરવો.",
      "chemical": "મેન્કોઝેબ ૭૫% ડબલ્યુપી (૨ ગ્રામ/લિટર) છાંટવું.",
      "remedy": "મેન્કોઝેબ ૬૦૦-૮૦૦ ગ્રામ પ્રતિ એકર છાંટવું."
    },
    "te": {
      "name": "గోధుమ రంగు తుప్పు తెగులు (Brown Rust)",
      "scientific": "Puccinia triticina",
      "status": "శిలీంద్ర తెగులు",
      "summary": "ఆకులపై గోధుమ రంగు గుండ్రని మచ్చలు ఏర్పడతాయి.",
      "organic": "వేప నూనె పిచికారీ చేయండి.",
      "chemical": "మాంకోజెబ్ 75% WP (2 గ్రా/లీటర్) పిచికారీ చేయండి.",
      "remedy": "ఎకరాకు 600-800 గ్రాముల మాంకోజెబ్ పిచికారీ చేయండి."
    },
    "ta": {
      "name": "பழுப்பு துரு நோய் (Brown Rust)",
      "scientific": "Puccinia triticina",
      "status": "பூஞ்சை நோய்",
      "summary": "இலைகளில் பழுப்பு நிற வட்டப் புள்ளிகள் தோன்றும்.",
      "organic": "வேப்ப எண்ணெய் தெளிக்கவும்.",
      "chemical": "மேன்கோசெப் 75% WP (2 கிராம்/லிட்டர்) தெளிக்கவும்.",
      "remedy": "மேன்கோசெப் ஏக்கருக்கு 600-800 கிராம் தெளிக்கவும்."
    },
    "kn": {
      "name": "ಕಂದು ತುಕ್ಕು ರೋಗ (Brown Rust)",
      "scientific": "Puccinia triticina",
      "status": "ಶಿಲೀಂಧ್ರ ರೋಗ",
      "summary": "ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ವೃತ್ತಾಕಾರದ ಕಲೆಗಳು ಕಾಣಿಸುತ್ತವೆ.",
      "organic": "ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.",
      "chemical": "ಮ್ಯಾಂಕೋಜೆಬ್ 75% WP (2 ಗ್ರಾಂ/ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.",
      "remedy": "ಎಕರೆಗೆ 600-800 ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ."
    },
    "ml": {
      "name": "തവിട്ട് തുരുമ്പ് രോഗം (Brown Rust)",
      "scientific": "Puccinia triticina",
      "status": "കുമിൾ രോഗം",
      "summary": "ഇലകളിൽ തവിട്ടുനിറത്തിലുള്ള പുള്ളികൾ കാണപ്പെടുന്നു.",
      "organic": "വേപ്പെണ്ണ മിശ്രിതം തളിക്കുക.",
      "chemical": "മാങ്കോസെബ് 75% WP (2 ഗ്രാം/ലിറ്റർ) തളിക്കുക.",
      "remedy": "ഏക്കറിന് 600-800 ഗ്രാം മാങ്കോസെബ് തളിക്കുക."
    },
    "ur": {
      "name": "بھوری کنگی (Brown Leaf Rust)",
      "scientific": "Puccinia triticina",
      "status": "پھپھوندی حملہ",
      "summary": "پتوں پر بیضوی اور گول بھورے رنگ کے دھبے بکھرے ہوئے دکھائی دیتے ہیں۔",
      "organic": "نیم کا عرق اسپرے کریں۔",
      "chemical": "مینکوزیب (2 گرام فی لیٹر) یا پروپیکونازول اسپرے کریں۔",
      "remedy": "مینکوزیب 600 تا 800 گرام فی ایکڑ اسپرے کریں۔"
    },
    "or": {
      "name": "ବାଦାମୀ କଳଙ୍କି ରୋଗ (Brown Rust)",
      "scientific": "Puccinia triticina",
      "status": "କବକ ଆକ୍ରମଣ",
      "summary": "ପତ୍ର ଉପରେ ବାଦାମୀ ରଙ୍ଗର ଗୋଲାକାର ଦାଗ ଦେଖାଯାଏ।",
      "organic": "ନିମ ତେଲ ସିଞ୍ଚନ କରନ୍ତୁ।",
      "chemical": "ମାଙ୍କୋଜେବ ୭୫% WP (୨ ଗ୍ରାମ/ଲିଟର) ସିଞ୍ଚନ କରନ୍ତୁ।",
      "remedy": "ମାଙ୍କୋଜେବ ଏକର ପିଛା ୬୦୦-୮୦୦ ଗ୍ରାମ ସିଞ୍ଚନ କରନ୍ତୁ।"
    },
    "resistantVarieties": [
      {
        "name": "HD-3086 (Pusa Gautami)",
        "region": "North Western & Central Plains",
        "features": "High Brown Rust resistance & stay-green trait"
      },
      {
        "name": "GW-322",
        "region": "Central & Western India",
        "features": "Excellent grain lustre and rust resilience"
      },
      {
        "name": "DBW-303",
        "region": "North-West India",
        "features": "Broad spectrum rust tolerance"
      }
    ]
  },
  "powderyMildew": {
    "id": "powderyMildew",
    "wheatTypeKey": "breadWheat",
    "en": {
      "name": "Wheat Powdery Mildew",
      "scientific": "Blumeria graminis f. sp. tritici",
      "status": "White Fungal Mycelium Growth",
      "summary": "White to grayish fluffy cotton-like fungal mycelium patches covering lower wheat leaves and stems, turning dull gray with tiny black cleistothecia dots.",
      "organic": "Spray Potassium Bicarbonate (5g/L) + 2ml bio-soap, or 40% raw milk in water solution.",
      "chemical": "Spray Wettable Sulfur 80% WDG @ 3g/L or Hexaconazole 5% EC @ 1ml/L or Propiconazole 25% EC @ 1ml/L.",
      "remedy": "Spray Wettable Sulfur 80% WDG @ 3g/L or Hexaconazole 5% EC @ 1ml/L. Thin overly dense canopies.",
      "prevention": [
        "Avoid dense shading and maintain 20cm row spacing for sun penetration.",
        "Avoid over-fertilization with nitrogenous fertilizers."
      ],
      "dosage": "Wettable Sulfur 80% WDG: 750g - 1kg per 200 Liters water per acre."
    },
    "hi": {
      "name": "गेहूं का चूर्णिल आसिता (Powdery Mildew)",
      "scientific": "ब्लूमेरिया ग्रेमिनिस (Blumeria graminis f. sp. tritici)",
      "status": "सफेद पाउडर फफूंद का फैलाव",
      "summary": "गेहूं की पत्तियों और तनों पर सफेद या धूसर रंग का आटा या रुई जैसा पाउडर जम जाता है, जिससे पत्तियां पीली पड़कर सूखने लगती हैं।",
      "organic": "बेकिंग सोडा (5 ग्राम/लीटर) + थोड़ा साबुन घोल या 40% कच्चा दूध + पानी का छिड़काव करें।",
      "chemical": "घुलनशील सल्फर 80% WDG (3 ग्राम/लीटर) या हेक्साकोनाज़ोल 5% EC (1 मिली/लीटर) का छिड़काव करें।",
      "remedy": "घुलनशील गंधक (सल्फर) 1 किग्रा प्रति एकड़ 200 लीटर पानी में मिलाकर छिड़कें।",
      "prevention": [
        "फसल को पर्याप्त धूप मिले, अत्यधिक सघन बुवाई से बचें।",
        "यूरिया की संतुलित मात्रा ही दें।"
      ],
      "dosage": "घुलनशील सल्फर 80% WDG: 1 किलोग्राम प्रति 200 लीटर पानी प्रति एकड़।"
    },
    "pa": {
      "name": "ਕਣਕ ਦਾ ਚਿੱਟਾ ਪਾਊਡਰ ਰੋਗ (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "ਚਿੱਟੀ ਉੱਲੀ ਦਾ ਹਮਲਾ",
      "summary": "ਪੱਤਿਆਂ ਉੱਤੇ ਚਿੱਟੇ ਜਾਂ ਸਲੇਟੀ ਰੰਗ ਦਾ ਪਾਊਡਰ ਜੰਮ ਜਾਂਦਾ ਹੈ।",
      "organic": "ਬੇਕਿੰਗ ਸੋਡਾ (5 ਗ੍ਰਾਮ/ਲੀਟਰ) ਘੋਲ ਕੇ ਛਿੜਕੋ।",
      "chemical": "ਘੁਲਣਸ਼ੀਲ ਸਲਫਰ 80% WDG (3 ਗ੍ਰਾਮ/ਲੀਟਰ) ਜਾਂ ਹੈਕਸਾਕੋਨਾਜ਼ੋਲ (1 ਮਿਲੀ/ਲੀਟਰ) ਛਿੜਕੋ।",
      "remedy": "ਸਲਫਰ 1 ਕਿਲੋ ਪ੍ਰਤੀ ਏਕੜ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਸਪਰੇਅ ਕਰੋ।",
      "prevention": [
        "ਹਵਾ ਅਤੇ ਧੁੱਪ ਦਾ ਸਹੀ ਪ੍ਰਬੰਧ ਰੱਖੋ।"
      ]
    },
    "mr": {
      "name": "गव्हावरील भुरी रोग (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "सल्फर बुरशीनाशक फवारा",
      "summary": "पानांवर पांढऱ्या पिठासारखी बुरशी वाढते.",
      "organic": "बेकिंग सोडा ५ ग्रॅम/लिटर पाण्यात फवारा.",
      "chemical": "विद्राव्य गंधक (Sulfur 80% WDG) ३ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा.",
      "remedy": "गंधक १ किलो २०० लिटर पाण्यातून एकरी फवारा."
    },
    "bn": {
      "name": "গমের পাউডারি মিলডিউ (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "সাদা পাউডার ছত্রাক",
      "summary": "পাতায় সাদা পাউডারের মতো ছত্রাকের প্রলেপ পড়ে।",
      "organic": "বেকিং সোডা দ্রবণ স্প্রে করুন।",
      "chemical": "সালফার ৮০% ডব্লিউডিজি (৩ গ্রাম/লিটার) স্প্রে করুন।",
      "remedy": "সালফার ১ কেজি একর প্রতি স্প্রে করুন।"
    },
    "gu": {
      "name": "ઘઉંનો છારો / ભૂકી છારો (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "સફેદ પાવડર ફૂગ",
      "summary": "પાંદડા પર સફેદ લોટ જેવો પાવડર જામી જાય છે.",
      "organic": "બેકિંગ સોડા ૫ ગ્રામ/લિટર છાંટવો.",
      "chemical": "દ્રાવ્ય ગંધક (સલ્ફર) ૩ ગ્રામ પ્રતિ લિટર છાંટવું.",
      "remedy": "સલ્ફર ૧ કિલો પ્રતિ એકર છાંટવું."
    },
    "te": {
      "name": "బూడిద తెగులు (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "బూడిద వంటి శిలీంద్రం",
      "summary": "ఆకులపై తెల్లటి బూడిద వంటి పొర ఏర్పడుతుంది.",
      "organic": "వంట సోడా ద్రావణం పిచಿಕారీ చేయండి.",
      "chemical": "సల్ఫర్ 80% WDG (3 గ్రా/లీటర్) పిచಿಕారీ చేయండి.",
      "remedy": "ఎకరాకు 1 కిలో సల్ఫర్ పిచికారీ చేయండి."
    },
    "ta": {
      "name": "சாம்பல் நோய் (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "வெள்ளை பூஞ்சை படிவு",
      "summary": "இலைகளில் வெள்ளை சாம்பல் போன்ற பூஞ்சை படரும்.",
      "organic": "பேக்கிங் சோடா தெளிக்கவும்.",
      "chemical": "கந்தகம் 80% WDG (3 கிராம்/லிட்டர்) தெளிக்கவும்.",
      "remedy": "கந்தகம் 1 கிலோ ஏக்கருக்கு தெளிக்கவும்."
    },
    "kn": {
      "name": "ಬೂದಿ ರೋಗ (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "ಬಿಳಿ ಪುಡಿ ರೋಗ",
      "summary": "ಎಲೆಗಳ ಮೇಲೆ ಬಿಳಿ ಬಣ್ಣದ ಪುಡಿ ಹರಡುತ್ತದೆ.",
      "organic": "ಅಡುಗೆ ಸೋಡಾ ಸಿಂಪಡಿಸಿ.",
      "chemical": "ಗಂಧಕ 80% WDG (3 ಗ್ರಾಂ/ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.",
      "remedy": "ಎಕರೆಗೆ 1 ಕೆಜಿ ಗಂಧಕ ಸಿಂಪಡಿಸಿ."
    },
    "ml": {
      "name": "പൊടിപ്പുപ്പൽ രോഗം (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "വെളുത്ത പൂപ്പൽ",
      "summary": "ഇലകളിൽ വെളുത്ത പൊടി രൂപത്തിൽ കുമിൾ പടരുന്നു.",
      "organic": "ബേക്കിംഗ് സോഡ തളിക്കുക.",
      "chemical": "സൾഫർ (3 ഗ്രാം/ലിറ്റർ) തളിക്കുക.",
      "remedy": "ഏക്കറിന് 1 കിലോ സൾഫർ തളിക്കുക."
    },
    "ur": {
      "name": "سفوفی پھپھوندی (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "سفید پاؤڈر کا حملہ",
      "summary": "پتوں پر سفید آٹے جیسا پاؤڈر جم جاتا ہے اور پتے سوکھنے لگتے ہیں۔",
      "organic": "بیکنگ سوڈا کا اسپرے کریں۔",
      "chemical": "سلفر (3 گرام فی لیٹر) یا ہیکسا کونازول اسپرے کریں۔",
      "remedy": "سلفر 1 کلو گرام فی 200 لیٹر پانی فی ایکڑ اسپرے کریں۔"
    },
    "or": {
      "name": "ପାଉଡରୀ ମିଲଡିଉ ରୋଗ (Powdery Mildew)",
      "scientific": "Blumeria graminis",
      "status": "ଧଳା ପାଉଡର କବକ",
      "summary": "ପତ୍ର ଉପରେ ଧଳା ପାଉଡର ପରି କବକ ଜମା ହୁଏ।",
      "organic": "ବେକିଂ ସୋଡା ସିଞ୍ଚନ କରନ୍ତୁ।",
      "chemical": "ଗନ୍ଧକ (ସଲଫର) ୩ ଗ୍ରାମ/ଲିଟର ସିଞ୍ଚନ କରନ୍ତୁ।",
      "remedy": "ଏକର ପ୍ରତି ୧ କିଲୋ ଗନ୍ଧକ ସିଞ୍ଚନ କରନ୍ତୁ।"
    },
    "resistantVarieties": [
      {
        "name": "PBW-550",
        "region": "North Western Plains",
        "features": "Resistant to powdery mildew and lodging"
      },
      {
        "name": "WH-1105",
        "region": "Haryana & Punjab",
        "features": "Strong tillering, clean foliage"
      },
      {
        "name": "HD-2967",
        "region": "Indo-Gangetic Plains",
        "features": "Moderate field tolerance"
      }
    ]
  },
  "septoriaBlotch": {
    "id": "septoriaBlotch",
    "wheatTypeKey": "breadWheat",
    "en": {
      "name": "Septoria Leaf Blotch",
      "scientific": "Zymoseptoria tritici (Septoria tritici)",
      "status": "Necrotic Foliar Blight Lesions",
      "summary": "Elongated irregular tan to light brown necrotic blotches bounded by leaf veins with yellow chlorotic margins and tiny distinct black pycnidia specks inside lesions.",
      "organic": "Spray bio-fungicide Pseudomonas fluorescens @ 5g/L or fermented garlic-chili extract.",
      "chemical": "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top) @ 1 ml/L or Chlorothalonil 75% WP @ 2g/L.",
      "remedy": "Spray Azoxystrobin + Difenoconazole @ 1ml/L or Chlorothalonil @ 2g/L. Destroy infected wheat crop residue.",
      "prevention": [
        "Incorporate crop residues into soil post-harvest to speed fungal breakdown.",
        "Rotate wheat with legume/mustard crops for at least 1-2 years.",
        "Treat seed with Carboxin 37.5% + Thiram 37.5% DS @ 2.5g/kg seed before sowing."
      ],
      "dosage": "Azoxystrobin + Difenoconazole: 200 ml in 200 Liters of water per acre."
    },
    "hi": {
      "name": "गेहूं का सेप्टोरिया पत्ती झुलसा (Septoria Leaf Blotch)",
      "scientific": "ज़ाइमोसेप्टोरिया ट्रिटिसाई (Zymoseptoria tritici)",
      "status": "पत्ती का परिगलन (नेक्रोसिस)",
      "summary": "पत्तियों पर नसों के बीच लंबे भूरे-बादामी धब्बे बनते हैं जिनके चारों ओर पीला घेरा होता है और धब्बों के अंदर बारीक काले बिंदु (पिक्नीडिया) दिखाई देते हैं।",
      "organic": "स्यूडोमोनास फ्लोरेसेंस (5 ग्राम/लीटर) या लहसुन-हींग का अर्क छिड़कें।",
      "chemical": "अज़ोक्सीस्ट्रोबिन + डाईफेनोकोनाज़ोल (1 मिली/लीटर) या क्लोरोथैलोनिल 75% WP (2 ग्राम/लीटर) का छिड़काव करें।",
      "remedy": "अमिस्टार टॉप (अज़ोक्सीस्ट्रोबिन + डाईफेनोकोनाज़ोल) 200 मिली प्रति 200 लीटर पानी प्रति एकड़ छिड़कें।",
      "prevention": [
        "बुवाई से पहले बीज को थीरम या कार्बाेंडाजिम (2.5 ग्राम/किग्रा) से उपचारित करें।",
        "गेहूं की कटाई के बाद फसल अवशेषों को मिट्टी में दबाएं या नष्ट करें।",
        "दलहनी फसलों के साथ फसल चक्र अपनाएं।"
      ],
      "dosage": "अज़ोक्सीस्ट्रोबिन + डाईफेनोकोनाज़ोल: 200 मिली प्रति 200 लीटर पानी प्रति एकड़।"
    },
    "pa": {
      "name": "ਸੈਪਟੋਰੀਆ ਝੁਲਸ ਰੋਗ (Septoria Leaf Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "ਪੱਤਿਆਂ ਤੇ ਕਾਲੇ-ਭੂਰੇ ਧੱਬੇ",
      "summary": "ਪੱਤਿਆਂ ਤੇ ਲੰਬੇ ਭੂਰੇ ਧੱਬੇ ਬਣਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਬਾਰੀਕ ਕਾਲੇ ਬਿੰਦੂ ਹੁੰਦੇ ਹਨ।",
      "organic": "ਸੂਡੋਮੋਨਾਸ ਬਾਇਓ-ਉੱਲੀਨਾਸ਼ਕ ਵਰਤੋ।",
      "chemical": "ਅਜ਼ੋਕਸੀਸਟ੍ਰੋਬਿਨ + ਡਾਈਫੇਨੋਕੋਨਾਜ਼ੋਲ (1 ਮਿਲੀ/ਲੀਟਰ) ਛਿੜਕੋ।",
      "remedy": "200 ਮਿਲੀ ਅਜ਼ੋਕਸੀਸਟ੍ਰੋਬਿਨ ਘੋਲ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ।",
      "prevention": [
        "ਬੀਜ ਸੋਧ ਕੇ ਬੀਜੋ।"
      ]
    },
    "mr": {
      "name": "सेप्टोरिया करपा रोग (Septoria Leaf Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "पानांवर करपा डाग",
      "summary": "पानांवर लांबट तपकिरी डाग पडतात आणि त्यात बारीक काळे ठिपके दिसतात.",
      "organic": "स्यूडोमोनास फ्लोರೆಸನ್స ५ ग्रॅम/लिटर फवारा.",
      "chemical": "अझॉक्सीस्ट्रोबिन + डायफेनोकोनाझोल १ मिली/लिटर फवारा.",
      "remedy": "२०० मिली औषध २०० लिटर पाण्यातून एकरी फवारा."
    },
    "bn": {
      "name": "সেপ্টোরিয়া পাতা পোড়া রোগ (Septoria Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "নেক্রোটিক দাগ",
      "summary": "পাতায় লম্বাটে বাদামী দাগ এবং মাঝে ছোট কালো বিন্দু দেখা যায়।",
      "organic": "সিউডোমোনাস স্প্রে করুন।",
      "chemical": "অ্যাজোক্সিস্ট্রোবিন + ডাইফেনোকোনাজল (১ মিলি/লিটার) স্প্রে করুন।",
      "remedy": "২০০ মিলি ওষুধ ২০০ লিটার পানিতে মিশিয়ে একর প্রতি স্প্রে করুন।"
    },
    "gu": {
      "name": "સેપ્ટોરિયા સુકારો (Septoria Leaf Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "પાનનો સુકારો",
      "summary": "પાંદડા પર લાંબા બદામી ડાઘા અને તેમાં ઝીણા કાળા ટપકાં દેખાય છે.",
      "organic": "સ્યુડોમોનાસ ૫ ગ્રામ/લિટર છાંટવું.",
      "chemical": "એઝોક્સીસ્ટ્રોબિન + ડાયફેનોકોનાઝોલ (૧ મિલી/લિટર) છાંટવું.",
      "remedy": "૨૦૦ મિલી દવા પ્રતિ ૨૦૦ લિટર પાણીમાં એકરે છાંટવી."
    },
    "te": {
      "name": "సెప్టోరియా ఆకు ఎండు తెగులు (Septoria Leaf Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "ఆకు ఎండు రోగం",
      "summary": "ఆకులపై పొడవాటి గోధుమ రంగు మచ్చలు మరియు నల్లని చుక్కలు కనిపిస్తాయి.",
      "organic": "సూడోమోనాస్ పిచికారీ చేయండి.",
      "chemical": "అజోక్సీస్ట్రోబిన్ + డైఫెనోకొనజోల్ (1 మి.లీ./లీటర్) పిచికారీ చేయండి.",
      "remedy": "ఎకరాకు 200 మి.లీ. మందు పిచికారీ చేయండి."
    },
    "ta": {
      "name": "செப்டோரியா இலைக்கருகல் (Septoria Leaf Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "இலைக்கருகல் நோய்",
      "summary": "இலைகளில் நீண்ட பழுப்பு நிற புள்ளிகள் மற்றும் சிறிய கருப்பு புள்ளிகள் தோன்றும்.",
      "organic": "சூடோமோனாஸ் தெளிக்கவும்.",
      "chemical": "அசோக்ஸிஸ்ட்ரோபின் (1 மி.லி./லிட்டர்) தெளிக்கவும்.",
      "remedy": "ஏக்கருக்கு 200 மி.லி அசோக்ஸிஸ்ட்ரோபின் தெளிக்கவும்."
    },
    "kn": {
      "name": "ಸೆಪ್ಟೋರಿಯಾ ಎಲೆ ಕರಗು ರೋಗ (Septoria Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "ಎಲೆ ಒಣಗುವ ರೋಗ",
      "summary": "ಎಲೆಗಳ ಮೇಲೆ ಉದ್ದನೆಯ ಕಂದು ಕಲೆಗಳು ಮತ್ತು ಸಣ್ಣ ಕಪ್ಪು ಚುಕ್ಕೆಗಳು ಕಾಣಿಸುತ್ತವೆ.",
      "organic": "ಸ್ಯೂಡೋಮೊನಾಸ್ ಸಿಂಪಡಿಸಿ.",
      "chemical": "ಅಜಾಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ (1 ಮಿ.ಲೀ./ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.",
      "remedy": "ಎಕರೆಗೆ 200 ಮಿ.ಲೀ. ಔಷಧ ಸಿಂಪಡಿಸಿ."
    },
    "ml": {
      "name": "സെപ്റ്റോറിയ ഇലക്കരിച്ചിൽ (Septoria Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "ഇല ഉണങ്ങുന്ന രോഗം",
      "summary": "ഇലകളിൽ നീളത്തിലുള്ള തവിട്ടുനിറത്തിലുള്ള പാടുകൾ കാണപ്പെടുന്നു.",
      "organic": "സ്യൂഡോമോണസ് തളിക്കുക.",
      "chemical": "അസോക്സിസ്ട്രോബിൻ (1 മി.ലി/ലിറ്റർ) തളിക്കുക.",
      "remedy": "ഏക്കറിന് 200 മി.ലി മരുന്ന് തളിക്കുക."
    },
    "ur": {
      "name": "سیپٹوریا جھلساؤ (Septoria Leaf Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "پتوں کا جھلساؤ",
      "summary": "پتوں پر بیضوی لمبے بھورے دھبے بنتے ہیں اور اندر باریک کالے نقطے ہوتے ہیں۔",
      "organic": "سیوڈوموناس بائیو اسپرے کریں۔",
      "chemical": "ایزوکسیسٹروبن + ڈائی فینوکونازول 200 ملی لیٹر فی ایکڑ اسپرے کریں۔",
      "remedy": "200 ملی لیٹر دوا 200 لیٹر پانی میں فی ایکڑ اسپرے کریں۔"
    },
    "or": {
      "name": "ସେପ୍ଟୋରିଆ ପତ୍ର ପୋଡା ରୋଗ (Septoria Blotch)",
      "scientific": "Zymoseptoria tritici",
      "status": "ପତ୍ର ଶୁଖିବା ରୋଗ",
      "summary": "ପତ୍ରରେ ଲମ୍ବା ବାଦାମୀ ଦାଗ ଏବଂ କଳା ବିନ୍ଦୁ ଦେଖାଯାଏ।",
      "organic": "ସୁଡୋମୋନାସ ସିଞ୍ଚନ କରନ୍ତୁ।",
      "chemical": "ଆଜୋକ୍ସିଷ୍ଟ୍ରୋବିନ (୧ ମି.ଲି./ଲିଟର) ସିଞ୍ଚନ କରନ୍ତୁ।",
      "remedy": "ଏକର ପ୍ରତି ୨୦୦ ମି.ଲି. ଔଷଧ ସିଞ୍ଚନ କରନ୍ତୁ।"
    },
    "resistantVarieties": [
      {
        "name": "DBW-187",
        "region": "Eastern & North-West Plains",
        "features": "High tolerance to leaf blight & rust complexes"
      },
      {
        "name": "HD-3118 (Pusa Vatsala)",
        "region": "Eastern India",
        "features": "High resistance to foliar blights and heat stress"
      },
      {
        "name": "HI-1612",
        "region": "Central & Peninsular India",
        "features": "Resistant to Septoria & spot blotch"
      }
    ]
  }
};

window.WHEAT_SAMPLES_LIST = [
  {
    "id": "wheat_healthy",
    "title": "Healthy Wheat Blade",
    "title_hi": "स्वस्थ गेहूं की पत्ती",
    "title_pa": "ਤੰਦਰੁਸਤ ਕਣਕ ਦਾ ਪੱਤਾ",
    "badge": "Healthy (T. aestivum)",
    "badge_hi": "स्वस्थ गेहूं",
    "badge_pa": "ਤੰਦਰੁਸਤ ਕਣਕ",
    "wheatType": "breadWheat",
    "filename": "wheat_healthy.jpg",
    "path": "static/samples/wheat_healthy.jpg"
  },
  {
    "id": "wheat_stripe_rust",
    "title": "Yellow / Stripe Rust",
    "title_hi": "पीला रतुआ (हल्दी रोग)",
    "title_pa": "ਪੀਲੀ ਕੁੰਗੀ (ਹਲਦੀ ਰੋਗ)",
    "badge": "P. striiformis",
    "badge_hi": "पीला रतुआ",
    "badge_pa": "ਪੀਲੀ ਕੁੰਗੀ",
    "wheatType": "breadWheat",
    "filename": "wheat_stripe_rust.jpg",
    "path": "static/samples/wheat_stripe_rust.jpg"
  },
  {
    "id": "wheat_leaf_rust",
    "title": "Brown / Leaf Rust",
    "title_hi": "भूरा रतुआ (पत्ती रतुआ)",
    "title_pa": "ਭੂਰੀ ਕੁੰਗੀ",
    "badge": "P. triticina",
    "badge_hi": "भूरा रतुआ",
    "badge_pa": "ਭੂਰੀ ਕੁੰਗੀ",
    "wheatType": "breadWheat",
    "filename": "wheat_leaf_rust.jpg",
    "path": "static/samples/wheat_leaf_rust.jpg"
  },
  {
    "id": "wheat_powdery_mildew",
    "title": "Wheat Powdery Mildew",
    "title_hi": "चूर्णिल आसिता (सफेद पाउडर)",
    "title_pa": "ਚਿੱਟਾ ਪਾਊਡਰ ਰੋਗ",
    "badge": "B. graminis",
    "badge_hi": "सफेद फफूंद",
    "badge_pa": "ਚਿੱਟੀ ਉੱਲੀ",
    "wheatType": "breadWheat",
    "filename": "wheat_powdery_mildew.jpg",
    "path": "static/samples/wheat_powdery_mildew.jpg"
  },
  {
    "id": "wheat_septoria_blotch",
    "title": "Septoria Leaf Blotch",
    "title_hi": "सेप्टोरिया पत्ती झुलसा",
    "title_pa": "ਸੈਪਟੋਰੀਆ ਝੁਲਸ ਰੋਗ",
    "badge": "Z. tritici",
    "badge_hi": "सेप्टोरिया",
    "badge_pa": "ਸੈਪਟੋਰੀਆ",
    "wheatType": "breadWheat",
    "filename": "wheat_septoria_blotch.jpg",
    "path": "static/samples/wheat_septoria_blotch.jpg"
  }
];

class WheatVisionEngine {
  /**
   * Converts 8-bit RGB [0..255] to HSV:
   * H in [0..360), S in [0..1], V in [0..1]
   */
  static rgbToHsv(r, g, b) {
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const df = mx - mn;
    let h = 0;
    if (mx === mn) {
      h = 0;
    } else if (mx === r) {
      h = (60 * ((g - b) / df) + 360) % 360;
    } else if (mx === g) {
      h = (60 * ((b - r) / df) + 120) % 360;
    } else if (mx === b) {
      h = (60 * ((r - g) / df) + 240) % 360;
    }
    const s = mx === 0 ? 0 : (df / mx);
    return [h, s, mx];
  }

  /**
   * Emulates PIL `img.convert('L').filter(ImageFilter.FIND_EDGES)`
   * Kernel: 3x3 Laplacian [-1, -1, -1, -1, 8, -1, -1, -1, -1]
   */
  static computeFindEdges(rgbaData, width, height) {
    const gray = new Uint8Array(width * height);
    for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
      // ITU-R BT.601 luma conversion matching Pillow RGB->L
      gray[i] = (rgbaData[p] * 19595 + rgbaData[p + 1] * 38470 + rgbaData[p + 2] * 7471 + 32768) >> 16;
    }

    const edges = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          edges[y * width + x] = gray[y * width + x];
          continue;
        }
        const idx = y * width + x;
        const val =
          8 * gray[idx] -
          gray[idx - width - 1] - gray[idx - width] - gray[idx - width + 1] -
          gray[idx - 1]         -                     gray[idx + 1] -
          gray[idx + width - 1] - gray[idx + width] - gray[idx + width + 1];
        edges[idx] = val < 0 ? 0 : (val > 255 ? 255 : val);
      }
    }
    return edges;
  }

  /**
   * Loads a DataURL or image URL into an HTMLImageElement
   */
  static loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error('Failed to decode image for vision analysis.'));
      img.src = src;
    });
  }

  /**
   * Validates that the uploaded image belongs to a Wheat plant (Poaceae monocot blade)
   * and rejects non-plant objects or broadleaf dicot crops (potato, tomato, cucumber, etc.).
   */
  static validateWheatLeafImage(imgElement) {
    const size = 120;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(imgElement, 0, 0, size, size);

    const rgba = ctx.getImageData(0, 0, size, size).data;
    const epx = this.computeFindEdges(rgba, size, size);

    let stripe_yellow = 0;
    let brown_rust = 0;
    let powdery_white = 0;
    let septoria_tan = 0;
    let green_px = 0;
    let dark_rot = 0;

    const angles = [];
    const magnitudes = [];

    const getR = (x, y) => rgba[(y * size + x) * 4];
    const getG = (x, y) => rgba[(y * size + x) * 4 + 1];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const pIdx = (y * size + x) * 4;
        const r = rgba[pIdx];
        const g = rgba[pIdx + 1];
        const b = rgba[pIdx + 2];
        const [h, s, v] = this.rgbToHsv(r, g, b);

        const is_plain_bg = (r > 240 && g > 240 && b > 240) || (r < 20 && g < 20 && b < 20) || (s < 0.04);
        const is_green = (g >= r * 1.05 && g >= b * 1.05 && g > 30) || (h >= 62 && h <= 170 && s > 0.14);
        const is_mildew = (!is_plain_bg) && (s < 0.30 && v > 0.45 && Math.abs(r - g) < 28 && Math.abs(g - b) < 28 && (r > 105 || g > 105));
        const is_pycnidia_black = (r < 48 && g < 48 && b < 48 && v < 0.20 && !is_plain_bg);
        const is_stripe_yellow = (h >= 36 && h <= 58 && s > 0.58 && v > 0.48);
        const is_brown_rust = (h >= 12 && h < 35 && s > 0.35 && v > 0.20 && r > b * 1.25);
        const is_septoria_tan = (h >= 22 && h < 55 && s > 0.22 && v > 0.30 && epx[y * size + x] > 22);
        const is_dark_rot = (v < 0.25 && r > 30 && g < 50);

        if (is_green) green_px++;
        if (is_stripe_yellow) stripe_yellow++;
        if (is_brown_rust) brown_rust++;
        if (is_mildew) powdery_white++;
        if (is_septoria_tan || is_pycnidia_black) septoria_tan++;
        if (is_dark_rot) dark_rot++;

        if (x >= 1 && x < size - 1 && y >= 1 && y < size - 1) {
          const dx = (getR(x + 1, y - 1) + 2 * getR(x + 1, y) + getR(x + 1, y + 1)) -
                     (getR(x - 1, y - 1) + 2 * getR(x - 1, y) + getR(x - 1, y + 1));
          const dy = (getR(x - 1, y + 1) + 2 * getR(x, y + 1) + getR(x + 1, y + 1)) -
                     (getR(x - 1, y - 1) + 2 * getR(x, y - 1) + getR(x + 1, y - 1));
          const mag = Math.sqrt(dx * dx + dy * dy);
          if (mag > 20) {
            angles.push(Math.atan2(dy, dx));
            magnitudes.push(mag);
          }
        }
      }
    }

    const num_bins = 18;
    const hist = new Float64Array(num_bins);
    let total_mag = 0;
    for (let i = 0; i < magnitudes.length; i++) total_mag += magnitudes[i];

    let peak_ratio = 1.0;
    if (total_mag > 0) {
      for (let i = 0; i < angles.length; i++) {
        const a = ((angles[i] % Math.PI) + Math.PI) % Math.PI;
        const bin = Math.floor(a / (Math.PI / num_bins)) % num_bins;
        hist[bin] += magnitudes[i];
      }
      let maxHist = 0;
      for (let i = 0; i < num_bins; i++) {
        if (hist[i] > maxHist) maxHist = hist[i];
      }
      peak_ratio = maxHist / ((total_mag / num_bins) + 1e-5);
    }

    const row_means = new Float64Array(size);
    const col_means = new Float64Array(size);
    for (let y = 0; y < size; y++) {
      let sum = 0;
      for (let x = 0; x < size; x++) sum += getG(x, y);
      row_means[y] = sum / size;
    }
    for (let x = 0; x < size; x++) {
      let sum = 0;
      for (let y = 0; y < size; y++) sum += getG(x, y);
      col_means[x] = sum / size;
    }

    let rowMeanAvg = 0, colMeanAvg = 0;
    for (let i = 0; i < size; i++) {
      rowMeanAvg += row_means[i];
      colMeanAvg += col_means[i];
    }
    rowMeanAvg /= size;
    colMeanAvg /= size;

    let row_var = 0, col_var = 0;
    for (let i = 0; i < size; i++) {
      row_var += (row_means[i] - rowMeanAvg) ** 2;
      col_var += (col_means[i] - colMeanAvg) ** 2;
    }
    row_var /= size;
    col_var /= size;

    const profile_ratio = Math.max(row_var, col_var) / (Math.min(row_var, col_var) + 1e-4);

    const total_foliar = green_px + stripe_yellow + brown_rust + powdery_white + septoria_tan;
    const foliar_pct = total_foliar / (size * size);

    if (foliar_pct < 0.35) {
      return {
        isWheat: false,
        errorType: 'NON_PLANT',
        messageEn: 'The uploaded image does not contain recognizable plant foliage.',
        messageHi: 'अपलोड की गई फोटो में पौधे की पत्ती नहीं पाई गई।'
      };
    }

    if (dark_rot > 450 && stripe_yellow < 150 && peak_ratio < 1.3) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image appears to be a broadleaf crop (e.g. Potato/Tomato) with late blight, not a wheat blade.',
        messageHi: 'अपलोड की गई फोटो गेहूं की पत्ती नहीं है (यह आलू/टमाटर जैसी चौड़ी पत्ती वाली फसल है)।'
      };
    }

    if (peak_ratio < 1.30 && stripe_yellow < 50 && profile_ratio < 2.0) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a broadleaf plant with reticulate venation, not a linear wheat leaf blade.',
        messageHi: 'अपलोड की गई फोटो चौड़ी पत्ती वाली फसल की है, गेहूं की पत्ती नहीं है।'
      };
    }

    if (powdery_white > 3500 && peak_ratio < 1.35) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a broadleaf plant affected by non-cereal powdery mildew, not a wheat leaf.',
        messageHi: 'अपलोड की गई फोटो चौड़ी पत्ती की है, गेहूं की पत्ती नहीं है।'
      };
    }

    if (stripe_yellow < 300 && dark_rot > 300 && peak_ratio < 1.45) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image shows concentric circular lesions of a broadleaf plant (Alternaria/Early Blight), not wheat.',
        messageHi: 'अपलोड की गई फोटो में चौड़ी पत्ती के गोल धब्बे हैं, यह गेहूं की पत्ती नहीं है।'
      };
    }

    if (green_px < 13500 && peak_ratio < 2.1 && stripe_yellow < 100 && brown_rust < 100 && septoria_tan < 400 && powdery_white < 500) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a broadleaf plant (Dicot), not a wheat crop leaf (Poaceae).',
        messageHi: 'अपलोड की गई फोटो गेहूं की फसल (पोएसी कुल) की पत्ती नहीं है।'
      };
    }

    return {
      isWheat: true,
      errorType: 'WHEAT_LEAF',
      messageEn: 'Valid Wheat Leaf',
      messageHi: 'वैध गेहूं की पत्ती'
    };
  }

  /**
   * Full On-Device Wheat Leaf Analysis & Heatmap Synthesis
   */
  static async analyze(imageInput, wheatType = 'breadWheat', lang = 'hi') {
    const imgElement = await this.loadImage(imageInput);
    const val = this.validateWheatLeafImage(imgElement);
    if (!val.isWheat) {
      return {
        status: 'error',
        error_type: val.errorType,
        is_wheat_leaf: false,
        message: val.messageEn,
        message_hi: val.messageHi,
        selectedLang: lang
      };
    }

    const analysis_size = 220;
    const canvas = document.createElement('canvas');
    canvas.width = analysis_size;
    canvas.height = analysis_size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(imgElement, 0, 0, analysis_size, analysis_size);

    const pixels = ctx.getImageData(0, 0, analysis_size, analysis_size).data;
    const edge_px = this.computeFindEdges(pixels, analysis_size, analysis_size);

    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = analysis_size;
    heatCanvas.height = analysis_size;
    const heatCtx = heatCanvas.getContext('2d');
    const heatImgData = heatCtx.createImageData(analysis_size, analysis_size);
    const hData = heatImgData.data;

    let leaf_pixels = 0;
    let green_pixels = 0;
    let stripe_yellow_rust = 0;
    let brown_leaf_rust = 0;
    let powdery_mildew = 0;
    let septoria_tan_decay = 0;

    for (let y = 0; y < analysis_size; y++) {
      for (let x = 0; x < analysis_size; x++) {
        const idx = y * analysis_size + x;
        const pIdx = idx * 4;
        const r = pixels[pIdx];
        const g = pixels[pIdx + 1];
        const b = pixels[pIdx + 2];
        const [h, s, v] = this.rgbToHsv(r, g, b);

        const is_green = (g >= r * 1.05 && g >= b * 1.05 && g > 30) || (h >= 62 && h <= 170 && s > 0.14);
        const is_pale_mildew = (s < 0.28 && v > 0.55 && Math.abs(r - g) < 28 && Math.abs(g - b) < 28 && (r > 115 || g > 115));
        const is_pycnidia_black = (r < 48 && g < 48 && b < 48 && v < 0.20);
        const is_stripe_yellow = (h >= 36 && h <= 58 && s > 0.58 && v > 0.48);
        const is_brown_rust = (h >= 12 && h < 35 && s > 0.35 && v > 0.20 && r > b * 1.25);
        const is_septoria_tan = (h >= 22 && h < 55 && s > 0.22 && v > 0.30 && edge_px[idx] > 22);

        if (is_green) {
          green_pixels++;
          leaf_pixels++;
        } else if (is_pale_mildew) {
          powdery_mildew++;
          leaf_pixels++;
          hData[pIdx] = 240; hData[pIdx + 1] = 240; hData[pIdx + 2] = 255; hData[pIdx + 3] = 220;
        } else if (is_pycnidia_black || is_septoria_tan) {
          septoria_tan_decay++;
          leaf_pixels++;
          hData[pIdx] = 220; hData[pIdx + 1] = 38; hData[pIdx + 2] = 38; hData[pIdx + 3] = 220;
        } else if (is_stripe_yellow) {
          stripe_yellow_rust++;
          leaf_pixels++;
          hData[pIdx] = 255; hData[pIdx + 1] = 215; hData[pIdx + 2] = 0; hData[pIdx + 3] = 230;
        } else if (is_brown_rust) {
          brown_leaf_rust++;
          leaf_pixels++;
          hData[pIdx] = 217; hData[pIdx + 1] = 119; hData[pIdx + 2] = 6; hData[pIdx + 3] = 230;
        }
      }
    }

    if (leaf_pixels === 0) leaf_pixels = 1;

    const total_diseased = stripe_yellow_rust + brown_leaf_rust + powdery_mildew + septoria_tan_decay;
    const disease_ratio = total_diseased / leaf_pixels;
    const affected_percentage = Math.round(disease_ratio * 1000) / 10;

    let disease_key = 'healthyWheat';
    let severity = 'healthy';
    let confidence = 96.0;

    if (disease_ratio < 0.025) {
      disease_key = 'healthyWheat';
      severity = 'healthy';
      confidence = Math.round((94.0 + (1.0 - disease_ratio * 20) * 5.2) * 10) / 10;
      confidence = Math.min(99.4, confidence);
    } else {
      if (powdery_mildew >= total_diseased * 0.35 || powdery_mildew > leaf_pixels * 0.04) {
        disease_key = 'powderyMildew';
        confidence = Math.round((94.0 + Math.min(4.8, (powdery_mildew / leaf_pixels) * 35)) * 10) / 10;
      } else if (stripe_yellow_rust >= leaf_pixels * 0.035 || (stripe_yellow_rust > brown_leaf_rust * 1.5 && stripe_yellow_rust > septoria_tan_decay * 0.7)) {
        disease_key = 'stripeRust';
        confidence = Math.round((95.0 + Math.min(4.2, (stripe_yellow_rust / leaf_pixels) * 40)) * 10) / 10;
      } else if (septoria_tan_decay >= leaf_pixels * 0.035 && powdery_mildew > leaf_pixels * 0.015) {
        disease_key = 'septoriaBlotch';
        confidence = Math.round((94.0 + Math.min(4.5, (septoria_tan_decay / leaf_pixels) * 40)) * 10) / 10;
      } else if (brown_leaf_rust > 0 || stripe_yellow_rust > 0) {
        disease_key = 'leafRust';
        confidence = Math.round((93.5 + Math.min(5.0, (brown_leaf_rust / leaf_pixels) * 38)) * 10) / 10;
      } else {
        disease_key = 'stripeRust';
        confidence = 91.0;
      }

      if (affected_percentage < 8.0) {
        severity = 'mild';
      } else if (affected_percentage < 25.0) {
        severity = 'moderate';
      } else {
        severity = 'severe';
      }
    }

    confidence = Math.min(99.1, Math.max(85.0, confidence));

    // Render blurred heatmap & composite over original resolution
    heatCtx.putImageData(heatImgData, 0, 0);
    const origW = Math.min(1024, imgElement.naturalWidth || imgElement.width || 600);
    const origH = Math.min(1024, imgElement.naturalHeight || imgElement.height || 600);

    const scaledHeatCanvas = document.createElement('canvas');
    scaledHeatCanvas.width = origW;
    scaledHeatCanvas.height = origH;
    const scaledHeatCtx = scaledHeatCanvas.getContext('2d');
    scaledHeatCtx.filter = 'blur(2px)';
    scaledHeatCtx.drawImage(heatCanvas, 0, 0, origW, origH);

    const compCanvas = document.createElement('canvas');
    compCanvas.width = origW;
    compCanvas.height = origH;
    const compCtx = compCanvas.getContext('2d');
    compCtx.drawImage(imgElement, 0, 0, origW, origH);
    compCtx.drawImage(scaledHeatCanvas, 0, 0, origW, origH);

    const heatmap_b64 = scaledHeatCanvas.toDataURL('image/png');
    const annotated_b64 = compCanvas.toDataURL('image/jpeg', 0.88);

    const disease_info = window.WHEAT_DISEASES_DATABASE[disease_key] || window.WHEAT_DISEASES_DATABASE['healthyWheat'];
    const wheat_species_info = window.WHEAT_TAXONOMY_DB.speciesTypes[wheatType] || window.WHEAT_TAXONOMY_DB.speciesTypes['breadWheat'];

    return {
      status: 'success',
      selectedLang: lang,
      crop: 'Wheat (Triticum)',
      taxonomy: {
        crop: window.WHEAT_TAXONOMY_DB.crop,
        family: window.WHEAT_TAXONOMY_DB.family,
        subfamily: window.WHEAT_TAXONOMY_DB.subfamily,
        tribe: window.WHEAT_TAXONOMY_DB.tribe,
        genus: window.WHEAT_TAXONOMY_DB.genus,
        identifiedType: wheat_species_info,
        selectedWheatTypeKey: wheatType
      },
      diseaseKey: disease_key,
      severity: severity,
      confidence: confidence,
      affectedPercentage: affected_percentage,
      leafPixelCount: leaf_pixels,
      lesionPixelCount: total_diseased,
      heatmapOverlayUrl: heatmap_b64,
      annotatedImageUrl: annotated_b64,
      diseaseData: disease_info,
      metrics: {
        healthyChlorophyllPct: Math.round((green_pixels / leaf_pixels) * 1000) / 10,
        stripeYellowRustPct: Math.round((stripe_yellow_rust / leaf_pixels) * 1000) / 10,
        brownLeafRustPct: Math.round((brown_leaf_rust / leaf_pixels) * 1000) / 10,
        powderyMildewPct: Math.round((powdery_mildew / leaf_pixels) * 1000) / 10,
        septoriaBlotchPct: Math.round((septoria_tan_decay / leaf_pixels) * 1000) / 10
      }
    };
  }
}

window.WheatVisionEngine = WheatVisionEngine;
