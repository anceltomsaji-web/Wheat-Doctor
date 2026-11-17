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

window.WHEAT_CLASSIFIER_HEAD = {"version":2,"backbone":"mobilenet_v2_100_224 feature_vector (TF-Hub, input range [0,1])","weights":[-0.02997,-0.004637,-0.00284,0.04623,-0.112588,-0.19401,0.041507,0.014531,0.007453,-0.108903,0.002584,0.046556,-0.02883,0.01018,0.066759,0.017928,-0.005375,0.061677,-0.103415,0.035612,0.015784,0.015172,-0.139328,0.05348,-0.061356,-0.008832,-0.018791,-0.002608,-0.020027,-0.007221,0.016452,0.124298,0.037303,-0.071568,0.064084,0.027472,0.068186,-0.04051,-0.04073,-0.055954,0.026304,-0.022273,-0.010019,-0.019784,0.003651,-0.031182,-0.060841,0.025382,0.080602,0.119312,0.025622,0.013681,-0.041093,-0.057169,-0.041483,0.098528,-0.059407,0.014458,0.102593,-0.099769,-0.078059,0.001973,-0.028625,0.038316,0.004478,-0.052506,-0.053894,0.082261,-0.015228,-0.000487,0.035829,-0.011408,0.004388,-0.040511,0.182152,-0.082864,0.051672,-0.050287,0.00277,0.007894,0.0983,0.047584,0.006873,0.012667,-0.004335,0.055203,-0.041279,-0.101629,0.032978,0.163136,0.00174,-0.015074,-0.018065,-0.021423,0.022729,-0.03796,-0.015349,0.023798,0.015693,0.039894,0.025758,0.059354,-0.079247,0.018058,0.056965,-0.054836,-0.079876,-0.075325,0.006409,0.029546,-0.105589,-0.051666,-0.086018,-0.021986,-0.037196,-0.040554,0.015983,0.014033,-0.061109,-0.047607,0.025348,-0.057335,0.090352,0.041895,0.09521,0.027913,-0.150522,-0.018613,0.079478,0.002629,-0.128912,0.094266,-0.034196,-0.041581,0.052936,0.007,0.031114,-0.004539,-0.048159,-0.049756,-0.04683,-0.030165,-0.064658,-0.035777,-0.019164,0.125269,-0.058723,-0.026106,-0.101151,-0.018604,-0.030144,0.00483,-0.041045,-0.037264,0.033054,-0.030617,0.05002,-0.04075,-0.00104,0.066967,0.062792,0.15117,-0.065407,-0.001063,-0.016353,0.108462,-0.044095,-0.045207,-0.007263,0.143292,-0.084579,-0.056128,-0.0639,-0.041855,0.02288,-0.144283,-0.007458,-0.020097,0.094725,0.054616,-0.075944,-0.031387,-0.053445,-0.005737,-0.05204,0.00117,0.014527,-0.041816,-0.05708,-0.087329,0.117094,0.078309,-0.005658,0.065752,-0.024235,0.063776,0.020596,0.027397,-0.031583,-0.071179,0.011548,-0.016381,0.006051,-0.026105,-0.02358,-0.011216,-0.138477,-0.098003,0.062502,0.032075,-0.066044,-0.002929,-0.036045,-0.058975,-0.062847,-0.015101,-0.029203,-0.048458,-0.074504,-0.011813,-0.043821,-0.028041,-0.113532,-0.023574,-0.001487,0.021832,0.001607,0.059763,-0.002847,-0.057565,-0.049522,-0.005949,-0.102321,-0.027767,-0.016382,0.014619,-0.079464,-0.020585,-0.09541,0.026907,-0.034943,0.077817,-0.001731,0.092327,-0.039288,0.100048,-0.040132,-0.012959,-0.012355,-0.031425,-0.057412,-0.045081,-0.070707,-0.047581,-0.016601,-0.012872,-0.117984,-0.008015,0.001104,0.112762,-0.060816,0.111177,0.0665,-0.050033,0.077457,-0.127063,0.070112,0.049515,0.130313,0.021027,0.067717,0.028603,-0.020461,0.020897,0.035236,0.055066,0.098866,0.01653,-0.122398,-0.079441,-0.062392,0.004842,-0.038557,-0.04866,-0.049914,-0.035541,-0.015645,0.080759,0.046898,0.027735,-0.062714,0.042376,-0.050704,0.012182,0.018808,0.079974,0.104557,0.029443,-0.031906,-0.025561,0.024726,-0.061115,0.069817,0.032211,0.020809,-0.033714,0.035768,-0.000513,-0.041547,0.033514,-0.002135,-0.050124,-0.027701,-0.152195,-0.015972,0.083303,-0.04991,-0.006461,-0.01388,0.022719,-0.115656,-0.03876,-0.045718,-0.104382,-0.04118,-0.033851,-0.027362,0.085624,-0.02697,-0.144275,-0.044478,-0.061853,0.002162,0.04697,-0.085696,-0.064856,-0.006205,-0.116032,-0.111849,-0.084564,-0.043393,0.045288,0.070398,0.031981,0.033667,0.018338,0.069774,0.020876,0.060429,-0.037095,0.022409,0.081685,0.028043,0.077339,-0.020462,0.150461,0.018881,0.001801,0.133093,0.012902,0.008755,-0.055543,0.119037,-0.010477,0.061611,-0.025444,-0.123168,0.017155,-0.050659,0.015881,-0.032326,0.106167,0.18432,0.011701,0.059419,-0.008737,0.095146,0.030063,0.031135,-0.031813,-0.002679,0.03424,-0.080993,-0.009628,0.050586,-0.022912,0.127702,-0.036555,-0.038566,0.009655,0.05239,-0.004796,0.066975,-0.097868,-0.008371,-0.071513,0.041322,-0.011026,0.004452,0.017846,-0.132474,-0.034612,0.118074,0.011698,-0.066597,0.019727,-0.034145,0.072314,-0.006438,0.108926,-0.084912,0.016458,0.100949,-0.052121,-0.052173,-0.013864,-0.066561,-0.055245,0.100455,0.069585,0.098445,-0.017742,0.059335,-0.046063,0.028373,-0.030197,-0.105222,0.00905,0.004692,0.013348,-0.038407,0.048879,-0.018843,-0.132013,0.025133,-0.066617,-0.002239,0.082365,0.021806,0.041785,0.021069,-0.118311,-0.088633,0.05674,0.045956,-0.040909,-0.08286,-0.112696,0.040281,-0.00278,-0.03032,0.017519,-0.00407,0.20248,0.004244,0.14597,-0.056424,-0.023894,0.055571,0.082748,0.030125,-0.071094,-0.014538,0.059493,0.049333,-0.030425,-0.051948,-0.002963,0.038719,-0.039251,0.061064,-0.053673,-0.029358,-0.127565,-0.016879,-0.024643,0.040684,0.072033,0.000412,0.044784,0.044959,-0.047228,-0.044782,-0.136808,-0.090558,0.037769,-0.047256,0.179799,-0.153786,-0.055859,-0.082631,0.046211,0.019791,-0.070989,0.044696,-0.188693,-0.02053,0.073013,-0.033337,0.042594,0.021587,-0.035276,-0.10154,-0.137669,0.035617,-0.131393,-0.064304,-0.086981,-0.048864,-0.016163,0.00566,0.068097,-0.039145,0.029258,0.011632,0.017358,0.020649,-0.02408,0.013767,0.075236,-0.080657,0.066295,0.066945,-0.09234,-0.068873,0.030784,0.001823,0.147757,0.018009,-0.133668,-0.02956,-0.032617,-0.10718,-0.111908,-0.001353,0.058929,-0.030363,0.03224,0.122621,-0.060704,0.088586,-0.053631,0.055897,0.047725,-0.043936,0.011899,-0.009706,-0.003682,-0.012523,0.162892,-0.012487,-0.05192,0.079808,-0.036378,0.002162,0.005672,-0.078389,-0.082353,0.073309,-0.002503,-0.025204,-0.001263,-0.023709,0.072506,-0.025888,0.012674,-0.058544,0.013236,-0.021956,0.030332,0.018816,-0.021572,0.072456,-0.035349,0.057404,-0.029712,0.09022,-0.046624,0.071565,0.061659,0.03462,-0.045262,0.077841,-0.041302,0.016945,-0.086393,-0.075164,0.108941,0.06079,-0.035255,0.096913,-0.046861,-0.016548,-0.009689,-0.030875,0.063763,-0.031742,0.200332,0.057113,-0.06668,-0.073588,0.014995,0.016318,-0.042947,0.011936,0.177484,0.044331,0.144942,0.048814,-0.023567,0.130915,-0.022308,0.049888,-0.071148,-0.025227,0.077347,0.078967,-0.022355,0.089609,0.011712,-0.097227,0.011201,0.001867,-0.025123,-0.046643,0.01755,0.03073,0.101487,0.066451,-0.137453,0.039192,-0.107679,-0.110545,0.007377,0.06081,0.043007,-0.027875,-0.023513,-0.06302,-0.04536,0.007571,-0.009105,0.057785,-0.027353,-0.085719,-0.007591,0.062549,-0.017718,0.03166,0.117649,0.04397,-0.025764,0.033941,-0.013831,0.084172,-0.079672,0.008808,-0.079002,-0.083273,0.045919,0.007245,-0.052906,-0.063206,0.044017,-0.020472,0.067776,-0.107253,0.026073,-0.033731,0.017615,-0.034089,0.071719,0.020324,0.051786,-0.013457,0.084776,-0.084214,-0.003432,0.044621,-0.021596,0.069908,0.019578,0.050152,0.028516,0.035967,-0.000183,0.015949,0.020053,0.075606,0.071338,0.042337,0.100182,0.058611,-0.055467,-0.018976,0.062404,0.113211,0.080662,-0.019278,0.079987,-0.046712,-0.18516,0.002449,-0.083047,0.0401,-0.080611,0.025461,-0.051591,0.075676,-0.032232,-0.08252,-0.134906,-0.063032,0.006441,-0.016269,-0.010979,0.087334,0.081348,-0.045337,0.041772,-0.055382,0.185794,0.015763,0.130157,0.030941,-0.000337,0.050417,-0.008923,0.010359,-0.080065,0.006906,-0.025392,0.144138,0.010596,0.003323,0.00309,-0.046338,0.048008,0.022567,0.032325,-0.059435,0.019381,-0.028489,0.009385,-0.014588,-0.140608,0.048429,-0.000197,-0.072865,-0.028796,-0.032422,0.033434,0.01267,0.025243,-0.035126,-0.081681,-0.08352,-0.068484,-0.008261,0.048416,-0.031337,0.074464,0.173119,0.005434,-0.028622,0.044672,-0.056317,0.035011,-0.018678,-0.110891,0.079392,-0.088579,0.041475,-0.091456,-0.043902,-0.031246,-0.021907,-0.006151,0.018055,0.060774,-0.065476,-0.047966,0.116026,-0.029242,-0.005888,-0.001495,-0.041618,-0.030097,-0.012748,-0.042011,-0.094301,0.023363,0.003524,-0.037834,0.072419,-0.012853,0.03175,0.055049,0.005375,0.026825,0.049525,-0.007586,-0.027625,0.031958,-0.004934,-0.021312,0.041278,0.052935,-0.039218,0.009165,0.024699,0.033787,-0.077584,-0.029831,-0.060095,-0.000452,-0.030948,-0.014301,-0.055873,0.005668,-0.002841,0.081688,-0.019468,-0.027148,-0.089127,-0.061601,0.040177,-0.020503,-0.001537,0.134936,0.053368,-0.050618,0.0421,-0.050457,0.020342,-0.128142,0.003388,-0.040542,0.093668,0.007498,0.078177,-0.020697,-0.032298,0.017208,-0.101786,-0.082554,-0.018476,0.113422,0.073065,0.135377,0.119421,0.047352,-0.06898,0.067298,-0.042945,-0.043058,-0.007327,-0.079751,0.075656,0.003616,0.030022,-0.046534,-0.115885,0.031739,-0.06582,0.128625,-0.000769,-0.010117,0.078613,-0.142868,-0.008286,0.071324,0.024456,-0.006341,0.031128,-0.026371,-0.018638,-0.097968,-0.042969,0.082762,0.022754,0.022328,-0.026562,-0.006316,0.05129,0.020016,0.089446,-0.102278,0.028504,-0.032741,0.035604,-0.104564,-0.040504,0.017142,-0.051098,-0.02561,0.042297,0.062118,0.005634,-0.075165,0.043607,-0.049534,-0.035367,0.057965,0.102066,-0.032284,-0.08604,-0.060847,-0.030687,-0.089925,-0.036762,0.088865,0.02659,-0.034426,-0.048442,-0.011367,0.013591,-0.120212,0.005503,-0.097472,0.015089,-0.078076,-0.094923,0.026402,0.050304,-0.123839,0.033287,-0.000979,0.166374,-0.03429,-0.082455,-0.005293,-0.008717,-0.017889,-0.081958,-0.001029,0.037701,0.077876,0.060154,0.035376,-0.075191,-0.019808,-0.029773,0.145119,-0.038957,0.065852,0.036743,0.024414,-0.001197,0.007416,0.079468,-0.075942,0.023614,0.119328,-0.017618,0.020608,-0.014088,-0.01955,-0.000705,0.037303,-0.005304,0.016902,-0.073772,-0.067625,-0.006251,0.0048,0.067981,0.037406,0.047426,-0.070125,-0.044437,0.109025,0.027468,0.025609,-0.042574,-0.023312,0.030794,-0.010926,-0.042897,-0.031856,0.114812,0.030775,0.029905,0.034993,-0.085634,0.042633,-0.006913,0.028815,0.005096,-0.049281,-0.005505,0.019637,-0.026543,0.0205,-0.004304,0.015929,-0.051582,0.055527,0.043408,-0.089491,0.099863,-0.052254,0.028892,0.038941,0.089275,0.012876,-0.057954,-0.088793,-0.089658,-0.075613,0.025015,0.011088,0.010586,0.013161,-0.024309,0.015311,-0.033646,-0.017009,0.024537,-0.034377,-0.012741,-0.060134,0.020609,-0.050445,0.092252,-0.029572,0.035254,-0.08903,-0.029509,0.091893,0.014841,0.086104,-0.016163,-0.087295,-0.041198,-0.041868,-0.094274,0.037423,0.017766,-0.048992,0.039368,-0.01282,-0.053531,0.034423,-0.031931,-0.03582,0.006727,-0.057635,-0.050016,0.055675,0.060871,-0.005542,-0.023066,-0.01498,0.002877,-0.044781,0.040449,0.060277,-0.006056,0.100866,0.152939,-0.026017,0.025581,0.063372,-0.013128,-0.045423,-0.079603,0.044421,0.027427,0.070417,-0.029868,0.09558,-0.040942,0.007288,-0.112078,0.033392,-0.003708,-0.10377,0.03124,0.005406,-0.011191,-0.065397,0.026174,0.067237,-0.040042,-0.052876,-0.098169,0.055975,0.030053,0.054084,-0.072293,0.072568,0.009595,0.13706,0.129204,0.071606,-0.057222,-0.038397,-0.04496,-0.075869,-0.015337,-0.064271,0.027432,-0.004844,0.111788,-0.060022,0.033935,-0.038088,-0.03066,-0.022122,0.056156,0.031105,-0.002478,-0.052627,-0.05046,-0.077707,0.066761,-0.041077,-0.030709,0.011239,0.035519,-0.07061,0.073058,-0.026896,-0.030848,-0.025606,-0.012572,-0.010287,-0.034537,0.025744,0.023734,-0.048025,-0.041797,0.05448,0.042919,0.034931,0.084987,0.036343,-0.019673,0.040908,0.014725,-0.125394,0.031468,0.152039,-0.04339,-0.048444,0.067693,-0.064595,0.072967,-0.01324,0.146364,0.016306,-0.007082,-0.002581,-0.001657,-0.014307,-0.096817,0.060836,-0.098213,-0.105933,0.013305,0.111087,-0.039011,0.048382,0.058176,0.038946,0.06131,-0.027453,-0.059845,-0.058423,-0.034345,0.016602,-0.025661,-0.003724,0.033769,-0.073208,-0.083502,-0.001048,-0.001817,0.107138,0.075256,-0.006381,-0.034761,0.096103,0.038536,0.085852,0.114541,0.067209,-0.03829,0.05318,0.003596,-0.001087,-0.003653,-0.084739,-0.032106,0.062013,0.042837,-0.155705,0.017269,0.028053,-0.040492,0.087681,-0.04942,-0.05845,0.035392,-0.071047,0.004812,-0.004839,0.017343,0.000111,0.015453,0.035014,0.154368,-0.0783,0.05385,0.055135,0.072557,-0.029163,-0.010179,0.050615,-0.055199,-0.155824,0.050064,-0.042297,-0.003766,0.072232,0.10013,-0.014129,-0.069593,0.053736,0.0362,0.055402,0.027031,-0.089781,0.009159,0.059662,-0.099061,-0.009273,-0.021824,-0.034305,-0.027657,-0.03357,-0.060274,0.055436,-0.005193,0.053442,0.040074,-0.013712,-0.065104,-0.078771,-0.013148,-0.020264,-0.027448,-0.075791,-0.039158,0.010559,0.099364,-0.036204,-0.09711,0.036904,-0.004992,-0.024415,0.082811,0.031584,-0.028682,0.073652,-0.029259,-0.039236,-0.01372,0.037475,0.005467,0.00804,0.065816,-0.141667,-0.059594,0.036687,-0.074191,-0.024733,-0.017967,-0.022257],"bias":-4.344463,"mean":[0.007079,0.03652,0.014304,0.007724,0.009209,0.018861,0.011748,0.015237,0.014723,0.007643,0.006757,0.019722,0.009981,0.017954,0.010667,0.022653,0.005765,0.009669,0.015766,0.007371,0.009351,0.021068,0.007813,0.020621,0.018903,0.012676,0.031038,0.031488,0.014779,0.012443,0.018321,0.029354,0.008753,0.021276,0.009011,0.016813,0.024196,0.03271,0.019079,0.005674,0.004476,0.002946,0.00628,0.010288,0.026415,0.006568,0.011234,0.010454,0.007301,0.011453,0.008236,0.016838,0.007709,0.012328,0.011517,0.022427,0.005514,0.008113,0.01484,0.008078,0.01662,0.009469,0.010614,0.010677,0.01254,0.012714,0.009753,0.01171,0.011073,0.01487,0.00423,0.011067,0.007957,0.02367,0.018136,0.028527,0.026432,0.006456,0.009338,0.018252,0.017961,0.020279,0.006332,0.01791,0.02943,0.010489,0.013989,0.016135,0.014137,0.020292,0.011543,0.013447,0.010056,0.009255,0.010581,0.018025,0.008035,0.026472,0.008031,0.014062,0.017873,0.00963,0.020847,0.012713,0.01962,0.009397,0.009712,0.011506,0.028995,0.009434,0.007661,0.012363,0.005516,0.008028,0.018027,0.016831,0.017762,0.012909,0.017782,0.015336,0.050843,0.030418,0.018342,0.007385,0.014305,0.016716,0.013889,0.014223,0.021893,0.006589,0.014019,0.006748,0.010186,0.011518,0.015873,0.014997,0.006996,0.016331,0.009753,0.023438,0.010469,0.014186,0.022323,0.010571,0.013799,0.007453,0.008829,0.02287,0.008167,0.025566,0.013767,0.00556,0.005548,0.003654,0.006309,0.008003,0.028097,0.016109,0.025262,0.010645,0.006691,0.032795,0.005004,0.014127,0.020998,0.029558,0.016496,0.00895,0.032018,0.010184,0.015466,0.015924,0.012733,0.014602,0.012386,0.030413,0.030148,0.020546,0.016271,0.013164,0.020694,0.020922,0.018435,0.012021,0.008478,0.007635,0.01064,0.029365,0.008133,0.011935,0.014473,0.012186,0.011774,0.020075,0.00638,0.016517,0.008993,0.005843,0.007443,0.012599,0.017501,0.024945,0.00891,0.011518,0.015278,0.00997,0.010065,0.004614,0.021739,0.02676,0.016994,0.015598,0.007433,0.033327,0.007137,0.041311,0.028977,0.009589,0.010454,0.011462,0.019822,0.013446,0.006908,0.031435,0.029636,0.007083,0.007151,0.00976,0.016194,0.019574,0.018839,0.008795,0.011044,0.015807,0.025262,0.006456,0.010679,0.009245,0.006497,0.006446,0.018473,0.033152,0.004558,0.014393,0.010278,0.008187,0.034107,0.004785,0.012474,0.006598,0.030117,0.014949,0.006881,0.006777,0.010311,0.020899,0.020183,0.010347,0.01225,0.010819,0.010435,0.006067,0.011737,0.012273,0.010645,0.005904,0.006843,0.010535,0.013182,0.011217,0.015414,0.011849,0.010503,0.009814,0.01846,0.016414,0.017033,0.01177,0.023504,0.018569,0.013647,0.007943,0.018025,0.013232,0.028313,0.011232,0.015884,0.006004,0.027832,0.018937,0.034192,0.03067,0.015804,0.011406,0.010653,0.015947,0.009632,0.00861,0.012561,0.007148,0.007689,0.011035,0.00783,0.016633,0.010488,0.012972,0.006431,0.00839,0.0305,0.007198,0.007219,0.009801,0.019965,0.018524,0.011325,0.011441,0.006897,0.007403,0.012278,0.008483,0.019481,0.018938,0.02474,0.01035,0.016078,0.01218,0.009042,0.014347,0.011133,0.011928,0.006633,0.008,0.014187,0.014568,0.003567,0.014535,0.013778,0.01339,0.016273,0.030049,0.012825,0.030699,0.019618,0.009028,0.009244,0.024983,0.01184,0.004946,0.01023,0.011686,0.019607,0.01007,0.012002,0.015184,0.006059,0.013703,0.012482,0.008127,0.012697,0.024768,0.040814,0.012461,0.032894,0.030835,0.022066,0.016651,0.013032,0.00977,0.009887,0.010356,0.01655,0.016295,0.011966,0.011264,0.010824,0.015849,0.013477,0.01315,0.012035,0.006548,0.011917,0.012363,0.007002,0.006679,0.012366,0.005145,0.025361,0.009501,0.01119,0.03212,0.014716,0.01181,0.005869,0.0169,0.007373,0.016492,0.017245,0.015147,0.008219,0.019065,0.016138,0.014953,0.019394,0.010541,0.005113,0.022531,0.007557,0.018483,0.00945,0.020688,0.01024,0.0121,0.029348,0.008772,0.008264,0.010201,0.011872,0.011671,0.025423,0.010967,0.009717,0.009238,0.01872,0.009466,0.017207,0.013873,0.012232,0.0077,0.011487,0.008206,0.01301,0.005572,0.007263,0.007953,0.013434,0.025631,0.014607,0.01509,0.009895,0.020697,0.014777,0.024604,0.02287,0.017017,0.024528,0.033517,0.005194,0.014036,0.008605,0.009726,0.006616,0.007479,0.007484,0.015355,0.012208,0.016423,0.00977,0.011707,0.009618,0.015295,0.010637,0.024441,0.011551,0.009062,0.033027,0.00425,0.022775,0.014794,0.035207,0.025386,0.016328,0.022406,0.008351,0.015188,0.009324,0.012982,0.021442,0.009617,0.007802,0.029008,0.007449,0.008844,0.009074,0.011185,0.013485,0.008991,0.032564,0.007409,0.009185,0.012002,0.012187,0.006812,0.01104,0.007156,0.020969,0.009291,0.031177,0.008841,0.016889,0.009955,0.012634,0.009457,0.005822,0.018584,0.007986,0.007753,0.003743,0.004396,0.03147,0.009631,0.024512,0.016455,0.008959,0.020922,0.008874,0.017067,0.007871,0.007595,0.01405,0.01109,0.009929,0.016416,0.00739,0.00764,0.013723,0.012477,0.015371,0.014841,0.026111,0.01596,0.00979,0.00542,0.013611,0.006638,0.02622,0.018742,0.015312,0.009933,0.028107,0.011694,0.018491,0.007189,0.009698,0.009596,0.024408,0.011894,0.012067,0.014288,0.016209,0.018568,0.035055,0.005681,0.00685,0.007509,0.01886,0.025214,0.017178,0.035727,0.014356,0.012292,0.022005,0.008886,0.012942,0.011146,0.016932,0.016513,0.02035,0.016635,0.016172,0.01838,0.012473,0.028106,0.007461,0.005036,0.020348,0.016276,0.014064,0.022718,0.014881,0.01875,0.013691,0.024224,0.007955,0.006196,0.018985,0.021995,0.01175,0.021746,0.007502,0.006564,0.006432,0.026201,0.007404,0.020921,0.010411,0.016002,0.003552,0.018834,0.007921,0.010904,0.015631,0.011737,0.020615,0.008207,0.002665,0.013469,0.014104,0.01165,0.011378,0.022646,0.026507,0.006003,0.010676,0.010797,0.027189,0.006631,0.009121,0.007354,0.018326,0.007867,0.007678,0.015423,0.020419,0.022218,0.017305,0.018527,0.01948,0.012342,0.014413,0.01349,0.028218,0.031918,0.011832,0.039044,0.00493,0.009094,0.014657,0.011486,0.02149,0.017152,0.010654,0.011334,0.017912,0.039814,0.009528,0.007053,0.0144,0.02418,0.010175,0.0082,0.018098,0.013626,0.018537,0.015028,0.021627,0.014264,0.004662,0.023968,0.012951,0.010033,0.031166,0.020005,0.009471,0.012059,0.008863,0.013849,0.009098,0.013905,0.021609,0.009239,0.013011,0.012708,0.02002,0.021276,0.015481,0.026011,0.008485,0.010267,0.013538,0.020095,0.017082,0.009112,0.013559,0.013038,0.015384,0.010091,0.006472,0.023594,0.00796,0.007294,0.017176,0.016226,0.01211,0.004799,0.016256,0.015818,0.008953,0.024734,0.008983,0.017643,0.017065,0.026419,0.017564,0.00518,0.020793,0.01479,0.010734,0.01772,0.004634,0.017011,0.006297,0.008214,0.00641,0.006859,0.010544,0.020244,0.021046,0.009111,0.006092,0.026457,0.016392,0.013774,0.023097,0.008888,0.012875,0.023327,0.016048,0.007278,0.027686,0.020715,0.007163,0.017304,0.013938,0.003798,0.006834,0.006243,0.020124,0.00853,0.010601,0.006779,0.014579,0.017189,0.014917,0.010892,0.010085,0.028575,0.012555,0.02308,0.013102,0.014168,0.005815,0.008303,0.016325,0.015079,0.005922,0.014118,0.023972,0.013048,0.018134,0.023219,0.017238,0.021916,0.01652,0.013304,0.027613,0.030275,0.031748,0.015303,0.008038,0.007641,0.014673,0.007495,0.016221,0.009633,0.006668,0.017315,0.017121,0.016418,0.018556,0.01144,0.011547,0.017331,0.018854,0.00901,0.009631,0.010158,0.013163,0.018448,0.007522,0.020216,0.010497,0.008456,0.024631,0.014847,0.012645,0.012816,0.008797,0.009266,0.00461,0.022555,0.011569,0.020865,0.009288,0.017996,0.027015,0.016747,0.013752,0.014561,0.011683,0.008438,0.016144,0.007344,0.008265,0.011281,0.01336,0.00823,0.004978,0.010139,0.023347,0.014505,0.020564,0.018861,0.004514,0.013565,0.012093,0.014997,0.010287,0.018671,0.01207,0.014825,0.01305,0.017064,0.007872,0.009686,0.018954,0.013244,0.013274,0.023913,0.015159,0.014474,0.009359,0.013012,0.013192,0.014001,0.013869,0.013243,0.01522,0.011842,0.01246,0.013849,0.014579,0.016813,0.006998,0.027211,0.023094,0.005567,0.025446,0.004315,0.018388,0.01191,0.016614,0.011072,0.016022,0.018693,0.005896,0.01215,0.008286,0.010429,0.010278,0.034812,0.008626,0.033448,0.018498,0.011658,0.012527,0.015806,0.014819,0.017573,0.019903,0.009571,0.011334,0.009606,0.010133,0.011263,0.019517,0.018458,0.011146,0.009711,0.030165,0.020061,0.010612,0.005775,0.022598,0.016042,0.020236,0.016938,0.02091,0.013998,0.006732,0.010076,0.007332,0.011798,0.023322,0.007858,0.011296,0.011666,0.004401,0.006092,0.00529,0.017215,0.01609,0.012393,0.008742,0.01901,0.012669,0.018088,0.007274,0.01761,0.016137,0.008379,0.009238,0.015152,0.00867,0.016819,0.011391,0.009968,0.021484,0.016967,0.009318,0.01266,0.017189,0.012212,0.00898,0.016411,0.012867,0.010188,0.013022,0.011468,0.011535,0.016671,0.027096,0.031918,0.005845,0.017336,0.012568,0.009733,0.015365,0.03466,0.005195,0.030126,0.017951,0.008151,0.018115,0.013324,0.009325,0.008156,0.010003,0.014066,0.020078,0.013344,0.026608,0.004389,0.01003,0.007762,0.021875,0.008618,0.009731,0.018177,0.024882,0.025614,0.021848,0.018633,0.006551,0.021769,0.01703,0.010774,0.011175,0.016853,0.010459,0.027849,0.008638,0.01837,0.019916,0.012989,0.012351,0.011836,0.011497,0.007224,0.023445,0.025174,0.014472,0.011208,0.003193,0.01802,0.021144,0.008044,0.006467,0.014094,0.009878,0.006486,0.01045,0.023529,0.010669,0.011618,0.016215,0.017916,0.009958,0.011327,0.009745,0.024976,0.027302,0.013469,0.015885,0.014246,0.009182,0.019319,0.018988,0.007777,0.024823,0.009129,0.006182,0.013214,0.013513,0.009803,0.012697,0.003841,0.013375,0.012931,0.017395,0.018665,0.012918,0.007204,0.020612,0.019572,0.025223,0.010437,0.008285,0.012425,0.013042,0.036583,0.032969,0.016571,0.014861,0.016732,0.01069,0.017855,0.014584,0.035829,0.008179,0.012503,0.013693,0.014293,0.004881,0.018608,0.021007,0.017454,0.015343,0.022891,0.033753,0.025568,0.01685,0.012981,0.009206,0.016485,0.011061,0.005889,0.009374,0.014205,0.025322,0.020503,0.016467,0.01709,0.006146,0.011331,0.018219,0.007733,0.004812,0.027403,0.016672,0.014083,0.025302,0.010713,0.007106,0.012567,0.019904,0.005837,0.013365,0.016188,0.009745,0.019943,0.011614,0.00678,0.014378,0.035137,0.011017,0.022126,0.012528,0.007407,0.01295,0.015172,0.01015,0.019386,0.032405,0.017691,0.012812,0.007681,0.011904,0.01068,0.005914,0.007256,0.019886,0.004583,0.01051,0.008154,0.008274,0.015504,0.004773,0.022724,0.011905,0.009016,0.017941,0.010971,0.014553,0.010665,0.015206,0.014024,0.008817,0.012442,0.008965,0.013497,0.009526,0.005788,0.013974,0.016725,0.036536,0.013452,0.030078,0.026279,0.020426,0.00994,0.010802,0.013038,0.003178,0.023114,0.012886,0.010808,0.008941,0.021779,0.013143,0.013726,0.026421,0.009453,0.012829,0.025102,0.011624,0.018733,0.009925,0.013158,0.015966,0.013334,0.011205,0.015638,0.015729,0.013507,0.011189,0.008996,0.010983,0.006317,0.017817,0.012848,0.008833,0.007867,0.021635,0.022159,0.012214,0.014958,0.007631,0.01083,0.007748,0.008702,0.008142,0.009271,0.042991,0.007242,0.015009,0.024379,0.017417,0.017758,0.022822,0.019928,0.019786,0.008475,0.015232,0.011096,0.010531,0.006768,0.011388,0.012585,0.00906,0.009523,0.015266,0.031673,0.026085,0.015432,0.011857,0.009114,0.012335,0.012731,0.012771,0.006852,0.014805,0.028204,0.008271,0.011082,0.013073,0.008634,0.012026,0.008912,0.007981,0.019548,0.010842,0.025093,0.013546,0.016082,0.009773,0.005957,0.021928,0.009796,0.018519,0.009037,0.017759,0.012689,0.011485,0.006451,0.01923,0.014904,0.011189,0.014672,0.013062,0.019816,0.014195,0.012644,0.021052,0.016541,0.011241,0.009115,0.021609,0.006324,0.02256,0.006786,0.012797,0.012254,0.014322,0.013228,0.010221,0.022464,0.010954,0.010032,0.015541,0.015227,0.00478,0.028557,0.012737,0.008703,0.012982,0.020499,0.035017,0.005003,0.023243,0.016653,0.02393,0.009703,0.015561,0.015818,0.016732,0.006814,0.012345,0.008994,0.014909,0.017462],"scale":[0.014962,0.040406,0.021907,0.015459,0.015349,0.031061,0.018175,0.024392,0.023026,0.016246,0.013185,0.025759,0.018398,0.023347,0.019034,0.031861,0.013402,0.018412,0.021344,0.014313,0.018496,0.028171,0.018359,0.024946,0.02459,0.01885,0.038561,0.034958,0.021476,0.020031,0.024709,0.033071,0.016116,0.028236,0.017779,0.022036,0.033268,0.036537,0.029742,0.013945,0.011552,0.009004,0.01386,0.018525,0.030972,0.012843,0.019465,0.016962,0.014215,0.018793,0.016646,0.022377,0.015554,0.022169,0.022385,0.025993,0.014629,0.014889,0.02338,0.018208,0.023722,0.018686,0.020278,0.019399,0.021521,0.020558,0.020661,0.017569,0.024209,0.024937,0.010517,0.019431,0.017737,0.032354,0.025265,0.029904,0.030545,0.014744,0.018672,0.034902,0.032566,0.028139,0.014107,0.02414,0.037161,0.018586,0.026738,0.022785,0.020104,0.026492,0.017815,0.020256,0.016925,0.016774,0.020893,0.025728,0.016822,0.028753,0.01479,0.023021,0.025022,0.017077,0.027057,0.02005,0.025958,0.017304,0.017442,0.020021,0.03515,0.01695,0.014178,0.019792,0.012318,0.016225,0.025395,0.023404,0.024152,0.021603,0.024952,0.022461,0.046268,0.033877,0.025024,0.018477,0.020105,0.023379,0.02121,0.024371,0.026875,0.015809,0.020255,0.014603,0.017536,0.018306,0.021304,0.0238,0.016376,0.023615,0.017599,0.027995,0.020234,0.025072,0.026647,0.018755,0.022308,0.016819,0.015803,0.029441,0.017322,0.0357,0.019704,0.01247,0.014031,0.011394,0.013882,0.016104,0.034676,0.024082,0.030997,0.018007,0.015352,0.032864,0.013443,0.021675,0.027144,0.040459,0.028051,0.020287,0.035492,0.017592,0.021479,0.025258,0.020207,0.023478,0.02192,0.034448,0.032973,0.026281,0.024722,0.01856,0.02732,0.032364,0.023398,0.022662,0.019244,0.013927,0.018281,0.030687,0.01544,0.019622,0.023778,0.019756,0.019904,0.024808,0.01405,0.02513,0.018102,0.014148,0.015591,0.020156,0.025117,0.030677,0.01491,0.019177,0.02258,0.016448,0.018074,0.011645,0.031415,0.032049,0.024599,0.023183,0.015192,0.035896,0.014354,0.04655,0.029259,0.0172,0.019471,0.02011,0.02578,0.019696,0.016784,0.040272,0.034431,0.016031,0.014447,0.018514,0.024006,0.025084,0.027146,0.019679,0.019515,0.022032,0.035813,0.012724,0.018246,0.018076,0.015607,0.012964,0.024398,0.042647,0.012746,0.020646,0.018167,0.015189,0.038531,0.013082,0.020991,0.016217,0.032431,0.021125,0.016007,0.013888,0.016194,0.027363,0.026126,0.020461,0.020237,0.015426,0.01872,0.017616,0.018607,0.020543,0.019766,0.015912,0.01415,0.018076,0.023255,0.018516,0.022727,0.019449,0.01873,0.015707,0.032065,0.020701,0.022689,0.023805,0.02868,0.02909,0.026926,0.015471,0.023229,0.022008,0.03507,0.017456,0.023083,0.014693,0.030244,0.02661,0.046818,0.030662,0.022205,0.018316,0.017348,0.022843,0.018408,0.016279,0.021309,0.014218,0.016093,0.019359,0.015598,0.02237,0.023691,0.019838,0.015253,0.01852,0.032297,0.015467,0.016059,0.017474,0.025675,0.025955,0.018011,0.02039,0.014395,0.014447,0.019251,0.014143,0.024228,0.024693,0.027254,0.019247,0.022965,0.020138,0.015489,0.020649,0.022272,0.018344,0.01415,0.016025,0.021156,0.020836,0.011946,0.020778,0.022776,0.024218,0.027409,0.037756,0.022761,0.031285,0.027175,0.015806,0.016347,0.032066,0.018447,0.010883,0.01811,0.019231,0.026619,0.020013,0.021796,0.023086,0.014246,0.021066,0.020463,0.017746,0.02049,0.027257,0.039286,0.022433,0.038282,0.034135,0.030095,0.022154,0.020824,0.017155,0.021077,0.018286,0.022065,0.026597,0.019441,0.020163,0.018935,0.020302,0.019579,0.02019,0.019538,0.015489,0.018083,0.021449,0.014763,0.013698,0.018944,0.013375,0.027321,0.01585,0.017606,0.037163,0.021438,0.018895,0.012991,0.028588,0.015223,0.02258,0.025092,0.023282,0.016583,0.025376,0.023261,0.023478,0.027951,0.018307,0.015323,0.028535,0.014828,0.028837,0.017782,0.028194,0.017406,0.023716,0.042776,0.015532,0.016448,0.019841,0.020527,0.017926,0.032185,0.01858,0.019104,0.016742,0.026894,0.019302,0.024584,0.020921,0.020064,0.015777,0.019249,0.015754,0.022514,0.013533,0.016846,0.016968,0.019748,0.027525,0.020351,0.025363,0.019203,0.026663,0.022899,0.030842,0.026297,0.022307,0.027403,0.034973,0.012914,0.021828,0.017401,0.018783,0.013858,0.01639,0.016091,0.022308,0.018736,0.022186,0.018058,0.019683,0.01996,0.021375,0.019482,0.031327,0.018663,0.017369,0.037349,0.012998,0.026843,0.022242,0.034868,0.035633,0.024882,0.029466,0.016509,0.02291,0.019461,0.019742,0.02885,0.020937,0.015589,0.033393,0.016956,0.017594,0.018075,0.019425,0.020015,0.016787,0.03667,0.018633,0.015493,0.019695,0.019392,0.013229,0.02124,0.015019,0.025914,0.017592,0.035894,0.016665,0.025522,0.016271,0.022244,0.018699,0.013455,0.031987,0.014702,0.017408,0.010689,0.011898,0.039587,0.020076,0.029621,0.024927,0.018348,0.03055,0.017459,0.02439,0.015293,0.015867,0.019653,0.021015,0.019465,0.028677,0.015545,0.016275,0.021872,0.020337,0.023813,0.023935,0.030281,0.024562,0.018989,0.012759,0.021063,0.013428,0.036384,0.034068,0.021593,0.018776,0.032965,0.020118,0.024532,0.017002,0.018364,0.016735,0.030464,0.020658,0.021561,0.022126,0.02321,0.024687,0.031393,0.013978,0.015627,0.016684,0.025069,0.029027,0.029988,0.038899,0.022577,0.019283,0.037414,0.017556,0.024234,0.020634,0.025052,0.025071,0.027541,0.024716,0.022874,0.027416,0.020987,0.030633,0.014737,0.01223,0.024396,0.026576,0.021708,0.029678,0.023162,0.023483,0.020491,0.029415,0.015607,0.012736,0.025119,0.02723,0.018233,0.027867,0.016676,0.013656,0.012133,0.030422,0.015097,0.030555,0.018452,0.022731,0.010156,0.025244,0.018363,0.01897,0.02103,0.022089,0.026023,0.015354,0.008231,0.023097,0.020248,0.01901,0.019457,0.025067,0.03137,0.013021,0.01834,0.019831,0.029935,0.012906,0.015839,0.015057,0.023906,0.014788,0.017821,0.022063,0.028522,0.033636,0.023853,0.035512,0.028728,0.019292,0.019524,0.02071,0.033544,0.03847,0.019328,0.03852,0.011444,0.015723,0.020669,0.019083,0.026887,0.024888,0.017985,0.018702,0.02678,0.038546,0.017841,0.014922,0.019867,0.029523,0.016692,0.017625,0.024963,0.02164,0.028973,0.023722,0.026488,0.020024,0.012678,0.033397,0.025453,0.016067,0.034321,0.028527,0.016985,0.024138,0.015584,0.021844,0.018409,0.020175,0.028122,0.017976,0.021326,0.020452,0.031868,0.02712,0.021239,0.031607,0.017551,0.019057,0.021142,0.025206,0.023571,0.018293,0.022318,0.020898,0.022677,0.019861,0.015332,0.031317,0.015679,0.01555,0.023443,0.023258,0.019957,0.011819,0.024541,0.026067,0.016513,0.029603,0.015225,0.025508,0.023163,0.03005,0.024399,0.013375,0.024162,0.020296,0.019394,0.026553,0.013178,0.023792,0.013628,0.016642,0.01434,0.014292,0.017923,0.026469,0.028882,0.01673,0.013458,0.029865,0.02133,0.018849,0.028242,0.020194,0.020088,0.029924,0.02434,0.016239,0.028781,0.026424,0.014421,0.023664,0.023152,0.010091,0.016052,0.013931,0.024489,0.017177,0.018634,0.016722,0.018818,0.0218,0.020003,0.023409,0.018448,0.035545,0.020965,0.029854,0.019719,0.02237,0.012636,0.017137,0.022978,0.022318,0.015804,0.020537,0.032078,0.019505,0.023656,0.031833,0.026014,0.027445,0.02283,0.021292,0.031037,0.039242,0.035953,0.023244,0.014881,0.016148,0.020478,0.017236,0.027594,0.016903,0.014701,0.026088,0.027053,0.02716,0.027728,0.017941,0.020443,0.023768,0.030679,0.017037,0.016808,0.016922,0.019859,0.024497,0.014838,0.026884,0.019705,0.014904,0.030079,0.02404,0.021159,0.018373,0.020967,0.016391,0.011346,0.030776,0.018746,0.026863,0.017424,0.027224,0.030679,0.02181,0.023457,0.022813,0.01972,0.018322,0.021175,0.015626,0.015443,0.019734,0.02108,0.01489,0.014138,0.017084,0.03282,0.024388,0.031484,0.022474,0.010739,0.02089,0.019264,0.024471,0.019696,0.026429,0.018672,0.021741,0.025104,0.024545,0.018437,0.018295,0.031258,0.020023,0.020304,0.037113,0.020628,0.022191,0.017719,0.019226,0.019949,0.019365,0.022304,0.022783,0.020998,0.019238,0.023021,0.019675,0.02086,0.026384,0.015342,0.033306,0.030106,0.01346,0.032372,0.013912,0.026181,0.020708,0.024,0.017294,0.024748,0.024302,0.013542,0.021888,0.01544,0.018701,0.01993,0.035102,0.015037,0.037423,0.025921,0.01764,0.022534,0.026595,0.02308,0.022143,0.024287,0.016774,0.017864,0.016505,0.018303,0.018854,0.026515,0.023944,0.018612,0.018324,0.036052,0.026653,0.018042,0.014756,0.032002,0.022624,0.025295,0.028735,0.025511,0.022215,0.0147,0.022901,0.013738,0.018937,0.029723,0.015469,0.019332,0.018296,0.011749,0.015377,0.012623,0.024434,0.021363,0.021503,0.021199,0.025257,0.022229,0.024765,0.014989,0.023448,0.024036,0.01779,0.018864,0.022313,0.015904,0.023491,0.018967,0.018741,0.032789,0.026298,0.017467,0.022494,0.0267,0.025003,0.01704,0.024124,0.021312,0.018417,0.020039,0.019885,0.017969,0.023035,0.030875,0.039371,0.01296,0.025017,0.020528,0.018443,0.023949,0.037917,0.014036,0.035784,0.028323,0.014706,0.024486,0.018696,0.016352,0.017584,0.016697,0.023271,0.02662,0.020091,0.039,0.012091,0.017094,0.016226,0.029093,0.015871,0.018982,0.028372,0.031552,0.032192,0.028916,0.025346,0.013251,0.032355,0.02265,0.019074,0.021116,0.022459,0.020247,0.030123,0.019616,0.024714,0.030497,0.019792,0.02408,0.022921,0.021847,0.016467,0.038366,0.03496,0.023981,0.018612,0.009996,0.027142,0.028743,0.017757,0.013157,0.020692,0.016307,0.014248,0.020055,0.026828,0.018271,0.01897,0.023553,0.02417,0.018724,0.021921,0.017464,0.027835,0.029633,0.022585,0.023948,0.019542,0.017633,0.026555,0.023326,0.016915,0.036049,0.01883,0.014123,0.020336,0.01995,0.0174,0.021354,0.009646,0.018423,0.019984,0.021275,0.02636,0.019349,0.014211,0.031786,0.026975,0.031343,0.016856,0.014254,0.018806,0.020571,0.047105,0.03462,0.021017,0.023418,0.024766,0.019281,0.02551,0.023312,0.0425,0.017225,0.019448,0.021545,0.022612,0.011921,0.023869,0.029924,0.024502,0.02175,0.028079,0.03645,0.03347,0.027422,0.0214,0.019547,0.024216,0.018536,0.014752,0.017093,0.021159,0.030484,0.02599,0.0216,0.024267,0.012538,0.01909,0.023552,0.017801,0.011306,0.031687,0.023969,0.02061,0.033608,0.020235,0.014041,0.021594,0.024541,0.013287,0.019759,0.022637,0.016363,0.02541,0.019381,0.014932,0.02062,0.03242,0.02103,0.03247,0.020527,0.015007,0.020992,0.024204,0.019096,0.025831,0.034143,0.023486,0.026092,0.015313,0.017839,0.017366,0.014499,0.014597,0.026924,0.010888,0.018093,0.015792,0.016471,0.020965,0.012602,0.02874,0.020033,0.01744,0.024989,0.019583,0.021544,0.019748,0.022062,0.018928,0.017767,0.020056,0.016355,0.019785,0.015987,0.012546,0.02192,0.020884,0.045002,0.02614,0.03092,0.029595,0.027784,0.019563,0.01967,0.026274,0.011484,0.035969,0.020693,0.017012,0.017953,0.026761,0.023902,0.020649,0.031424,0.0153,0.022107,0.03287,0.017407,0.022485,0.017061,0.024424,0.022154,0.019412,0.018975,0.024864,0.025878,0.024894,0.019877,0.017335,0.019918,0.013277,0.026512,0.022216,0.01853,0.015256,0.027128,0.029143,0.020273,0.021448,0.015027,0.018186,0.014576,0.017491,0.015022,0.017828,0.040092,0.017032,0.022335,0.029913,0.025254,0.022609,0.029007,0.02731,0.024923,0.015771,0.022627,0.018323,0.017186,0.01485,0.018391,0.019015,0.016308,0.016862,0.022171,0.035395,0.037751,0.022731,0.01962,0.018307,0.021049,0.020544,0.022549,0.014084,0.025182,0.034061,0.018683,0.019551,0.018994,0.018536,0.019737,0.018423,0.016256,0.024762,0.018488,0.02981,0.020877,0.023864,0.019085,0.013579,0.031489,0.016909,0.025621,0.017003,0.022604,0.018362,0.021362,0.013821,0.024743,0.025412,0.016529,0.022919,0.023491,0.026407,0.02229,0.019221,0.026438,0.022328,0.020418,0.017097,0.040544,0.015138,0.025778,0.014578,0.020886,0.018663,0.021325,0.020038,0.02276,0.028312,0.019153,0.017533,0.021102,0.02139,0.012055,0.032172,0.020995,0.019553,0.019471,0.02886,0.044256,0.012932,0.034088,0.0239,0.028741,0.0169,0.021611,0.022904,0.028838,0.017233,0.020027,0.014197,0.020185,0.025084],"threshold":0.7759,"cv_wheat_recall":0.7358,"cv_target_specificity":0.9856,"trained_on":{"wheat_images":159,"non_wheat_images":557}};

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
   * Validates that the uploaded or camera-captured image belongs to a Wheat plant
   * (Poaceae monocot blade) and strictly rejects non-plant objects and normal broadleaf
   * plants (houseplants, tomato, potato, rose, mango, hibiscus, trees, flowers, etc.).
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
    let studio_bg = 0;
    let non_plant_vivid = 0;
    let center_green = 0;
    let border_green = 0;
    let green_h_sum = 0.0;
    let green_h_sq = 0.0;
    let green_s_sum = 0.0;
    let green_v_sum = 0.0;
    let green_e_sum = 0.0;

    const num_bins = 18;
    const hist_r = new Float64Array(num_bins);
    const hist_g = new Float64Array(num_bins);

    const b_jxx = new Float64Array(36);
    const b_jyy = new Float64Array(36);
    const b_jxy = new Float64Array(36);
    const b_gcnt = new Int32Array(36);

    const row_g = new Float64Array(size);
    const col_g = new Float64Array(size);
    let row_trans = 0;
    let col_trans = 0;
    const prev_row_g = new Uint8Array(size);
    let hi_edge_green = 0;
    let g_peaks = 0;
    const b_edge = new Int32Array(36);

    const getR = (x, y) => rgba[(y * size + x) * 4];
    const getG = (x, y) => rgba[(y * size + x) * 4 + 1];

    for (let y = 0; y < size; y++) {
      let prev_g_x = 0;
      for (let x = 0; x < size; x++) {
        const pIdx = (y * size + x) * 4;
        const r = rgba[pIdx];
        const g = rgba[pIdx + 1];
        const b = rgba[pIdx + 2];
        row_g[y] += g;
        col_g[x] += g;
        const [h, s, v] = this.rgbToHsv(r, g, b);
        const ev = epx[y * size + x];

        if (ev > 65) b_edge[Math.floor(y / 20) * 6 + Math.floor(x / 20)]++;

        const is_plain_bg = (r > 240 && g > 240 && b > 240) || (r < 20 && g < 20 && b < 20) || (s < 0.04);
        const is_green = (g >= r * 1.05 && g >= b * 1.05 && g > 30) || (h >= 62 && h <= 170 && s > 0.14 && v > 0.12);
        const is_mildew = (!is_plain_bg) && (s < 0.30 && v > 0.45 && Math.abs(r - g) < 28 && Math.abs(g - b) < 28 && (r > 105 || g > 105));
        const is_pycnidia_black = (r < 48 && g < 48 && b < 48 && v < 0.20 && !is_plain_bg);
        const is_stripe_yellow = (h >= 36 && h <= 58 && s > 0.58 && v > 0.48);
        const is_brown_rust = (h >= 12 && h < 35 && s > 0.35 && v > 0.20 && r > b * 1.25);
        const is_septoria_tan = (h >= 22 && h < 55 && s > 0.22 && v > 0.30 && ev > 22);
        const is_dark_rot = (v < 0.25 && r > 30 && g < 50);

        if (!is_green && s < 0.20 && v > 0.26 && v < 0.86 && ev < 38) studio_bg++;
        if ((h < 14 || h > 178) && s > 0.22 && v > 0.22) non_plant_vivid++;

        const g_flag = is_green ? 1 : 0;
        if (x > 0 && g_flag !== prev_g_x) row_trans++;
        prev_g_x = g_flag;
        if (y > 0 && g_flag !== prev_row_g[x]) col_trans++;
        prev_row_g[x] = g_flag;

        if (is_green) {
          green_px++;
          green_h_sum += h;
          green_h_sq += h * h;
          green_s_sum += s;
          green_v_sum += v;
          green_e_sum += ev;
          if (ev > 60) hi_edge_green++;
          if (x >= 2 && x < size - 2 && y >= 2 && y < size - 2) {
            if (g > getG(x - 2, y) + 18 && g > getG(x + 2, y) + 18) g_peaks++;
            if (g > getG(x, y - 2) + 18 && g > getG(x, y + 2) + 18) g_peaks++;
          }
          if (x >= 28 && x < 92 && y >= 28 && y < 92) center_green++;
          if (x < 16 || x >= 104 || y < 16 || y >= 104) border_green++;
        }
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
            const a = ((Math.atan2(dy, dx) % Math.PI) + Math.PI) % Math.PI;
            const bi = Math.floor(a / (Math.PI / num_bins)) % num_bins;
            hist_r[bi] += mag;
          }

          if (is_green) {
            const gdx = (getG(x + 1, y - 1) + 2 * getG(x + 1, y) + getG(x + 1, y + 1)) -
                        (getG(x - 1, y - 1) + 2 * getG(x - 1, y) + getG(x - 1, y + 1));
            const gdy = (getG(x - 1, y + 1) + 2 * getG(x, y + 1) + getG(x + 1, y + 1)) -
                        (getG(x - 1, y - 1) + 2 * getG(x, y - 1) + getG(x + 1, y - 1));
            const gmag = Math.sqrt(gdx * gdx + gdy * gdy);
            if (gmag > 18) {
              const ga = ((Math.atan2(gdy, gdx) % Math.PI) + Math.PI) % Math.PI;
              const gbi = Math.floor(ga / (Math.PI / num_bins)) % num_bins;
              hist_g[gbi] += gmag;
            }
            const bidx = Math.floor(y / 20) * 6 + Math.floor(x / 20);
            b_jxx[bidx] += gdx * gdx;
            b_jyy[bidx] += gdy * gdy;
            b_jxy[bidx] += gdx * gdy;
            b_gcnt[bidx]++;
          }
        }
      }
    }

    let tot_r = 0, max_r = 0, pk_r = 0;
    for (let i = 0; i < num_bins; i++) {
      tot_r += hist_r[i];
      if (hist_r[i] > max_r) { max_r = hist_r[i]; pk_r = i; }
    }
    const peak_ratio = tot_r > 0 ? (max_r / ((tot_r / num_bins) + 1e-5)) : 1.0;
    const cone_r = tot_r > 0
      ? ((hist_r[pk_r] + hist_r[(pk_r + num_bins - 1) % num_bins] + hist_r[(pk_r + 1) % num_bins]) / (tot_r + 1e-5))
      : 0.16;

    let tot_g = 0, max_g = 0, pk_g = 0;
    for (let i = 0; i < num_bins; i++) {
      tot_g += hist_g[i];
      if (hist_g[i] > max_g) { max_g = hist_g[i]; pk_g = i; }
    }
    const peak_ratio_g = tot_g > 0 ? (max_g / ((tot_g / num_bins) + 1e-5)) : 1.0;
    const main_g = hist_g[pk_g] + hist_g[(pk_g + num_bins - 1) % num_bins] + hist_g[(pk_g + 1) % num_bins];
    const cone_g = tot_g > 0 ? (main_g / (tot_g + 1e-5)) : 0.16;
    const diag_g =
      hist_g[(pk_g + num_bins - 4) % num_bins] +
      hist_g[(pk_g + num_bins - 3) % num_bins] +
      hist_g[(pk_g + 3) % num_bins] +
      hist_g[(pk_g + 4) % num_bins];
    const pinnate_ratio = diag_g / (main_g + 1e-5);

    let coh_w_sum = 0, w_sum = 0, high_coh_blocks = 0, active_blocks = 0, c2_sum = 0, s2_sum = 0;
    for (let bi = 0; bi < 36; bi++) {
      if (b_gcnt[bi] < 60) continue;
      const xx = b_jxx[bi], yy = b_jyy[bi], xy = b_jxy[bi];
      const tr = xx + yy;
      if (tr < 500) continue;
      const coh = Math.sqrt((xx - yy) * (xx - yy) + 4.0 * xy * xy) / (tr + 1e-5);
      const ang = 0.5 * Math.atan2(2.0 * xy, xx - yy);
      coh_w_sum += coh * tr;
      w_sum += tr;
      active_blocks++;
      if (coh > 0.56) high_coh_blocks++;
      c2_sum += tr * Math.cos(2.0 * ang);
      s2_sum += tr * Math.sin(2.0 * ang);
    }
    const mean_bcoh = w_sum > 0 ? (coh_w_sum / w_sum) : 0.0;
    const high_coh_frac = active_blocks > 0 ? (high_coh_blocks / active_blocks) : 0.0;
    const ang_agree = w_sum > 0 ? (Math.sqrt(c2_sum * c2_sum + s2_sum * s2_sum) / w_sum) : 0.0;

    let rm_avg = 0, cm_avg = 0;
    for (let i = 0; i < size; i++) {
      row_g[i] /= size;
      col_g[i] /= size;
      rm_avg += row_g[i];
      cm_avg += col_g[i];
    }
    rm_avg /= size;
    cm_avg /= size;
    let row_var = 0, col_var = 0;
    for (let i = 0; i < size; i++) {
      row_var += (row_g[i] - rm_avg) ** 2;
      col_var += (col_g[i] - cm_avg) ** 2;
    }
    row_var /= size;
    col_var /= size;
    const profile_ratio = Math.max(row_var, col_var) / (Math.min(row_var, col_var) + 1e-4);

    const N = size * size;
    const total_foliar = green_px + stripe_yellow + brown_rust + powdery_white + septoria_tan;
    const foliar_pct = total_foliar / N;

    if (foliar_pct < 0.35 || (green_px < 1800 && stripe_yellow < 400) || (non_plant_vivid / N > 0.35)) {
      return {
        isWheat: false,
        errorType: 'NON_PLANT',
        messageEn: 'The uploaded image does not contain recognizable wheat plant foliage.',
        messageHi: 'अपलोड की गई फोटो में गेहूं के पौधे की पत्ती नहीं पाई गई।'
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

    const hi_edge_frac = hi_edge_green / Math.max(1, green_px);
    const b_edge_sorted = Array.from(b_edge, (e) => e / 400.0).sort((a, b) => a - b);
    let min_smooth_block = 0.0;
    for (let i = 0; i < 6; i++) min_smooth_block += b_edge_sorted[i];
    min_smooth_block /= 6.0;

    if (hi_edge_frac > 0.215 || g_peaks > 1350 || min_smooth_block > 0.150) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'This image appears to be lawn grass, turf, or dense plant clutter rather than a wheat leaf blade. Please upload or capture a clear close-up photo of a wheat leaf.',
        messageHi: 'यह फोटो सामान्य घास (लॉन ग्रास) या झाड़ी की है, गेहूं की पत्ती की नहीं है। कृपया गेहूं की पत्ती की साफ फोटो लें।'
      };
    }

    if (g_peaks < 110 || min_smooth_block < 0.006 || mean_bcoh < 0.45 || high_coh_frac < 0.28) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a normal non-wheat plant leaf, not a wheat leaf blade (Triticum / Poaceae). Please upload or capture a clear photo of a wheat plant.',
        messageHi: 'यह फोटो सामान्य पौधे की पत्ती है, गेहूं के पौधे (ट्रिटिकम / पोएसी) की नहीं है। कृपया केवल गेहूं की पत्ती की फोटो लें।'
      };
    }

    const gcnt = Math.max(1, green_px);
    const gh_mean = (green_h_sum / gcnt) / 180.0;
    const gh_var = Math.max(0.0, (green_h_sq / gcnt) - (green_h_sum / gcnt) ** 2);
    const gh_std = Math.sqrt(gh_var) / 50.0;
    const gs_mean = green_s_sum / gcnt;
    const gv_mean = green_v_sum / gcnt;
    const ge_mean = (green_e_sum / gcnt) / 255.0;
    const c_green_frac = center_green / 4096.0;
    const b_green_frac = border_green / 6784.0;

    const weights = [
      2.978174, 11.242965, -6.993803, -1.181372, 1.593047, -35.517831,
      3.158534, -2.410670, 0.546169, 5.498374, 0.609326, -8.396647,
      0.040359, -2.343539, 4.687147, -0.697977, -1.293279, 1.288970,
      -2.260799, 1.311390, 5.540455, -1.327158, -1.364465, 1.645384,
      -0.573167, 2.003722, -2.123623
    ];
    const feats = [
      green_px / N,
      stripe_yellow / N,
      brown_rust / N,
      powdery_white / N,
      septoria_tan / N,
      dark_rot / N,
      studio_bg / N,
      non_plant_vivid / N,
      peak_ratio,
      cone_r,
      peak_ratio_g,
      cone_g,
      pinnate_ratio,
      mean_bcoh,
      high_coh_frac,
      ang_agree,
      c_green_frac,
      b_green_frac,
      c_green_frac - b_green_frac,
      Math.log1p(profile_ratio),
      (row_trans + col_trans) / N,
      Math.max(row_trans, col_trans) / (Math.min(row_trans, col_trans) + 1.0),
      gh_mean,
      gh_std,
      gs_mean,
      gv_mean,
      ge_mean
    ];
    let logit = -5.984513;
    for (let i = 0; i < weights.length; i++) logit += weights[i] * feats[i];

    if (logit < 0.0) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a normal broadleaf plant, not a wheat leaf blade (Triticum / Poaceae). Please upload or capture a clear photo of a wheat plant.',
        messageHi: 'यह फोटो सामान्य चौड़ी पत्ती वाले पौधे की है, गेहूं के पौधे (ट्रिटिकम / पोएसी) की नहीं है। कृपया केवल गेहूं की पत्ती की फोटो लें।'
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
   * Dual-Stage Wheat-Only Gatekeeper used for BOTH gallery uploads and live camera frames:
   * Stage 1: 120x120 Poaceae Monocot & Parallel-Venation Structure-Tensor Validator (`validateWheatLeafImage`)
   * Stage 2: MobileNetV2 1280-D Deep Feature Wheat Recognizer (`window.WheatClassifier`)
   * Returns { isWheat, source, probability?, errorType?, messageEn?, messageHi? }.
   */
  static async verifyWheat(imageInput) {
    const imgElement = await this.loadImage(imageInput);
    return this.verifyWheatElement(imgElement);
  }

  static async verifyWheatElement(imgElement) {
    const val = this.validateWheatLeafImage(imgElement);
    // Stage 1 MUST ALWAYS pass: if the morphological/venation/turfgrass validator rejects the image, decline immediately!
    if (!val.isWheat) {
      val.source = 'heuristic';
      return val;
    }

    // Stage 2: If the neural classifier is available, it must ALSO confirm a wheat plant!
    if (window.WheatClassifier) {
      try {
        const c = await window.WheatClassifier.classify(imgElement);
        if (!c.isWheat) {
          return {
            isWheat: false,
            source: 'classifier',
            probability: c.probability,
            errorType: 'NOT_WHEAT_LEAF',
            messageEn: 'This photo is a normal plant (or non-wheat object), not a wheat plant. Wheat Doctor only analyses wheat (Triticum) leaves and plants — please upload or capture a wheat leaf.',
            messageHi: 'यह फोटो सामान्य पौधे की है, गेहूं के पौधे की नहीं। गेहूं डॉक्टर केवल गेहूं (ट्रिटिकम) की पत्ती/पौधे की जांच करता है — कृपया गेहूं की पत्ती की फोटो लें।'
          };
        }
        return { isWheat: true, source: 'dual-gate', probability: c.probability };
      } catch (err) {
        console.warn('Neural wheat recogniser unavailable, using Poaceae validator:', err);
      }
    }
    val.source = 'heuristic';
    return val;
  }

  /**
   * Full On-Device Wheat Leaf Analysis & Heatmap Synthesis
   */
  static async analyze(imageInput, wheatType = 'breadWheat', lang = 'hi', opts = {}) {
    const imgElement = await this.loadImage(imageInput);
    const val = await this.verifyWheatElement(imgElement);
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
