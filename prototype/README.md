# 🌾 Wheat Doctor — Bilingual Prototype (English & Hindi)

A specialized AI diagnostic prototype for Wheat crops (*Triticum aestivum*, *T. durum*, *T. dicoccum*), focusing specifically on **English** and **Hindi (हिन्दी)** with full botanical taxonomy (*Poaceae* / *Gramineae*), foliar rust heatmaps, and voice-assisted diagnostic prescriptions.

---

## 📂 Prototype Directory Structure

```
Wheat-Doctor/prototype/
├── app.py                  # Flask web server (Bilingual EN/HI REST APIs & TTS)
├── model.py                # AI morphology analysis, rust heatmaps & bilingual disease DB
├── tunnel.py               # Cloudflare / LAN mobile tunnel helper
├── requirements.txt        # Python dependencies
├── start.bat               # 1-Click launcher for Windows (Local & Global access)
├── verify_prototype.py     # Automated test suite
├── templates/
│   └── index.html          # Bilingual frontend UI with instant EN/HI switcher
└── static/
    ├── style.css           # Modern glassmorphism UI & responsive animations
    ├── app.js              # Bilingual controller & speech synthesis
    └── samples/            # 5 Calibrated wheat leaf test samples
```

---

## 🚀 How to Run the Prototype

### Method 1: Using the 1-Click Launcher (Windows)
Double-click `start.bat` in the `prototype/` folder.
- **Option 1**: Local mode (`http://127.0.0.1:5000`)
- **Option 2**: Worldwide Public HTTPS Mode (Accessible on any mobile phone/network)

### Method 2: Command Line
```bash
# Navigate to the prototype directory
cd prototype

# Start locally
python app.py

# Or start with public tunnel enabled
python app.py --online
```

---

## 🧪 Verification & Testing

Run the automated verification suite:
```bash
python prototype/verify_prototype.py
```

### Verified Capabilities:
- ✅ **Calibrated Diagnostics**: Accurate classification of Healthy, Yellow/Stripe Rust (*Puccinia striiformis*), Brown/Leaf Rust (*Puccinia triticina*), Powdery Mildew (*Blumeria graminis*), and Septoria Leaf Blotch (*Zymoseptoria tritici*).
- ✅ **Bilingual Localization**: Instant switching between English (🇬🇧) and Hindi (🇮🇳) across all UI titles, botanical taxonomy, and treatment recommendations.
- ✅ **Rust Heatmaps**: Dynamic glowing overlay visualization of infection pustules and necrotic lesions.
- ✅ **Audio Prescription**: High quality Text-to-Speech in both Hindi and English.
