# 🌾 Wheat Doctor — Global Access & Sharing Guide (दुनिया भर से कहीं भी एक्सेस करें)

This guide explains how anyone on **ANY network (Jio, Airtel, Vi, 4G, 5G, Remote Wi-Fi, across the globe)** can open and use Wheat Doctor easily.

---

## ⚡ Method 1: Instant 1-Click Worldwide Public Access (From Your PC)
> **Best For**: Immediate testing, sharing live demonstrations with farmers, doctors, or colleagues anywhere in the world.

### How to Run:
1. Double-click **`start_online.bat`** (or choose Option `1` in `start.bat`).
2. The terminal will generate a secure HTTPS link, for example:
   ```text
   =================================================================
    [PUBLIC INTERNET ACCESS ACTIVE - ANY NETWORK]
    Anyone on ANY network (4G/5G/Wi-Fi) can access via:
    >>> https://example-subdomain.trycloudflare.com <<<
   =================================================================
   ```
3. **Open on any phone or share with anyone**:
   - Send that `https://...` link via WhatsApp, SMS, or Email.
   - Or click the **🌐 Share** button inside the app and scan the **Global QR Code** with any phone's camera / Google Lens.
   - Works on 4G, 5G, or any Wi-Fi in any location!

### ✨ Advantages:
- **Zero Configuration**: No router port forwarding, no accounts, no sign-ups required.
- **Genuine HTTPS**: Phone cameras and microphones work immediately on mobile Chrome/Safari without security warnings.
- **100% Free**: Unlimited bandwidth via Cloudflare Quick Tunnels.

---

## 🌐 Method 2: Permanent 24/7 Cloud Hosting (Always Online Free)
> **Best For**: Keeping Wheat Doctor online 24 hours a day, 7 days a week, even when your computer is turned off.

### Option A: Free Hosting on Render (Recommended)
1. Create a free account at [render.com](https://render.com).
2. Upload this folder to your GitHub account as a repository (e.g. `Wheat-Doctor`).
3. On Render Dashboard: Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Render will automatically detect `requirements.txt` and `render.yaml` (or set `Build Command`: `pip install -r requirements.txt`, `Start Command`: `gunicorn app:app --bind 0.0.0.0:$PORT`).
6. Click **Deploy Web Service**.
7. You will get a permanent worldwide URL like `https://wheat-doctor.onrender.com`!

### Option B: Free Hosting on Hugging Face Spaces
1. Create a free account at [huggingface.co](https://huggingface.co).
2. Go to **Spaces** -> **Create New Space**.
3. Choose **Docker** (Blank) or **Gradio/Flask**.
4. Upload all project files including `Dockerfile` and `requirements.txt`.
5. Hugging Face builds and hosts it 24/7 with a permanent public link!

---

## 📱 In-App Sharing Features

When the app is open:
- Click the **🌐 Share** button in the top navigation bar.
- **Tab 1: 🌍 Global Link (Any Network)**:
  - Displays the live HTTPS link.
  - Generates a high-resolution QR code.
  - **Copy Link**: Copies the link to clipboard.
  - **WhatsApp**: 1-click button to share directly on WhatsApp with pre-filled title and instructions.
  - **Enable Global Link**: If started in local mode, clicking this button activates global access on-the-fly!
- **Tab 2: 🏠 Local Wi-Fi**:
  - Displays the local LAN IP (`http://192.168.x.x:5000`) for private intranet use on the same router.
