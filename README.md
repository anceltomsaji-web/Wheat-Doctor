# 🌾 Wheat Doctor AI (गेहूं डॉक्टर / ਕਣਕ ਡਾਕਟਰ) — v2.0
### AI-Powered Wheat Crop Pathology, Cultivar & Botanical Taxonomy Diagnostic System (Android APK + PWA + Flask Cloud)

An AI diagnostic application engineered specifically for **Wheat (*Triticum*)** crops across Indian agro-climatic zones. Operates **100% offline on Android phones** (via Native Android `.apk` & PWA) as well as online via Python Flask.

---

## 📲 Install on Android Phones via GitHub (Zero Errors)

### Method 1: Native Android `.APK` (Automated via GitHub Actions & Releases)
1. Push this repository to your GitHub account by double-clicking **`push_to_github.bat`** (or running `git push -u origin main`).
2. **GitHub Actions** (`.github/workflows/android-apk.yml`) automatically compiles, signs, and publishes **`Wheat-Doctor-v2.0-Android.apk`** to your repository's **Releases** page and **Actions Artifacts**.
3. Open your GitHub repository's **Releases** tab on any Android phone, tap **`Wheat-Doctor-v2.0-Android.apk`**, and tap **Install**!
   - ✅ **100% Standalone & Offline**: Runs the complete Poaceae morphological validator, HSV + Sobel + Laplacian vision classifier, glowing lesion heatmap generator, and 12-language database directly on the phone's processor (`static/vision_engine.js`).
   - ✅ **Native Android Voice (TTS)**: Bridges directly to Android's native `android.speech.tts.TextToSpeech` engine (`MainActivity.java`) for offline voice guidance in Hindi, Punjabi, English, and regional Indian languages.
   - ✅ **Live Camera & Gallery Support**: Full WebRTC camera reticle viewfinder and native Android photo picker integration.

### Method 2: 1-Tap Android PWA Install (via GitHub Pages)
1. In your GitHub repo, go to **Settings -> Pages** and set **Source** to **GitHub Actions** (`.github/workflows/deploy-pages.yml`).
2. Open `https://<your-username>.github.io/Wheat-Doctor/` in Chrome on your Android phone.
3. Tap **📲 Android App** in the top navigation bar -> **⚡ Install Wheat Doctor App Now**.

---

## 🌟 Key Features

1. **Poaceae Monocot Morphological Gate (`validate_wheat_leaf_image`)**:
   - Computes 18-bin Sobel directional gradient histograms (`peak_ratio`) and 1D green-channel spatial variance (`profile_ratio`) to verify linear parallel-veined wheat blades (*Poaceae*) and automatically reject non-plant objects (`NON_PLANT`) or broadleaf dicot crops (`NOT_WHEAT_LEAF` — e.g., potato, tomato, cucumber).
2. **Dedicated 5-Class Wheat Pathology Diagnostic**:
   - **Yellow / Stripe Rust** (*Puccinia striiformis f. sp. tritici*)
   - **Brown / Leaf Rust** (*Puccinia triticina*)
   - **Wheat Powdery Mildew** (*Blumeria graminis f. sp. tritici*)
   - **Septoria Tritici Leaf Blotch** (*Zymoseptoria tritici*)
   - **Healthy Wheat Foliage** (*Triticum aestivum*)
3. **Botanical Family & Cultivar Ploidy Classification**:
   - **Botanical Family**: `Poaceae / Gramineae` (True Grass Family / घास कुल / ਘਾਹ ਪਰਿਵਾਰ)
   - **Wheat Cultivar Types**:
     - *Bread Wheat / Common Wheat* (*Triticum aestivum* L. — Hexaploid $2n = 6x = 42$)
     - *Durum / Pasta Wheat* (*Triticum durum* Desf. — Tetraploid $2n = 4x = 28$)
     - *Emmer / Khapli Wheat* (*Triticum dicoccum* Schübl. — Tetraploid $2n = 4x = 28$)
4. **12 Indian Languages with Voice Narration**:
   - Hindi (हिंदी), Punjabi (ਪੰਜਾਬੀ), English, Marathi (मराठी), Bengali (বাংলা), Gujarati (ગુજરાતી), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Urdu (اردو), Odia (ଓଡ଼ିଆ).
5. **Glowing RGBA Lesion Heatmaps**:
   - Real-time Gaussian-blurred ($\sigma = 1.8$) alpha-composited heatmap isolating yellow uredinia stripes, brown pustules, white mycelial colonies, and necrotic blotches.

---

## 📁 Project Structure
```
Wheat-Doctor/
├── .github/workflows/
│   ├── android-apk.yml         # Automated GitHub Actions Android APK builder & Release publisher
│   └── deploy-pages.yml        # Automated GitHub Pages PWA deployment workflow
├── android/                    # Complete Native Android Gradle Project (SDK 34, Java 17)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml # Camera, Media & Android 11+ TTS service queries
│   │   ├── java/com/wheatdoctor/ai/MainActivity.java # Native WebView + AndroidTTS Bridge
│   │   ├── assets/www/         # Bundled standalone offline web application
│   │   └── res/                # Adaptive mipmap launcher icons & dark botanical theme
│   ├── build.gradle
│   └── settings.gradle
├── dist/                       # Pre-built standalone PWA bundle for GitHub Pages
├── prototype/                  # Bilingual (English & Hindi) edition
├── static/
│   ├── vision_engine.js        # On-device HTML5 Canvas Computer Vision & Pathology Engine
│   ├── app.js                  # 12-Language UI controller, WebRTC camera & 3-tier TTS
│   ├── style.css               # Golden-emerald glassmorphic botanical UI
│   ├── manifest.json           # PWA Web App Manifest
│   ├── sw.js                   # Offline Service Worker
│   ├── icons/                  # 192x192, 512x512, Apple Touch & Favicon PNGs
│   └── samples/                # Calibrated wheat & non-wheat verification samples
├── templates/
│   └── index.html              # 4-screen responsive application template
├── app.py                      # Flask REST API & gTTS audio streaming server
├── model.py                    # Python PIL Computer Vision & 12-language pathology engine
├── tunnel.py                   # Cloudflare / SSH Pinggy global HTTPS tunnel manager
├── build_android_bundle.py     # Automated asset, icon & vision engine bundler
├── push_to_github.bat          # 1-Click GitHub push & APK build launcher
├── start.bat                   # 1-Click Windows local/global server launcher
└── PROJECT_REPORT.md           # Full mathematical, algorithmic & line-by-line code report
```

---

## 📖 Detailed Project Report
See [**`PROJECT_REPORT.md`**](./PROJECT_REPORT.md) for the complete mathematical derivations, computer vision algorithms, and line-by-line code documentation of the entire system.
