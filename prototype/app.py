import os
import io
import json
import socket
import sys
from flask import Flask, render_template, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from gtts import gTTS
from model import analyze_wheat_leaf_image, WHEAT_DISEASES_DB, WHEAT_TAXONOMY
import tunnel

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['JSON_AS_ASCII'] = False
CORS(app)

# Supported languages in prototype: English and Hindi
TTS_LANG_MAP = {
    'hi': 'hi',
    'en': 'en'
}

WHEAT_SAMPLES_METADATA = [
    {
        'id': 'wheat_healthy',
        'title': 'Healthy Wheat Blade',
        'title_hi': 'स्वस्थ गेहूं की पत्ती',
        'badge': 'Healthy (T. aestivum)',
        'badge_hi': 'स्वस्थ गेहूं',
        'wheatType': 'breadWheat',
        'filename': 'wheat_healthy.jpg',
        'path': '/static/samples/wheat_healthy.jpg'
    },
    {
        'id': 'wheat_stripe_rust',
        'title': 'Yellow / Stripe Rust',
        'title_hi': 'पीला रतुआ (हल्दी रोग)',
        'badge': 'P. striiformis',
        'badge_hi': 'पीला रतुआ',
        'wheatType': 'breadWheat',
        'filename': 'wheat_stripe_rust.jpg',
        'path': '/static/samples/wheat_stripe_rust.jpg'
    },
    {
        'id': 'wheat_leaf_rust',
        'title': 'Brown / Leaf Rust',
        'title_hi': 'भूरा रतुआ (पत्ती रतुआ)',
        'badge': 'P. triticina',
        'badge_hi': 'भूरा रतुआ',
        'wheatType': 'breadWheat',
        'filename': 'wheat_leaf_rust.jpg',
        'path': '/static/samples/wheat_leaf_rust.jpg'
    },
    {
        'id': 'wheat_powdery_mildew',
        'title': 'Wheat Powdery Mildew',
        'title_hi': 'चूर्णिल आसिता (सफेद पाउडर)',
        'badge': 'B. graminis',
        'badge_hi': 'सफेद फफूंद',
        'wheatType': 'breadWheat',
        'filename': 'wheat_powdery_mildew.jpg',
        'path': '/static/samples/wheat_powdery_mildew.jpg'
    },
    {
        'id': 'wheat_septoria_blotch',
        'title': 'Septoria Leaf Blotch',
        'title_hi': 'सेप्टोरिया पत्ती झुलसा',
        'badge': 'Z. tritici',
        'badge_hi': 'सेप्टोरिया',
        'wheatType': 'breadWheat',
        'filename': 'wheat_septoria_blotch.jpg',
        'path': '/static/samples/wheat_septoria_blotch.jpg'
    }
]

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('static', 'manifest.json', mimetype='application/manifest+json')

@app.route('/sw.js')
def serve_sw():
    return send_from_directory('static', 'sw.js', mimetype='application/javascript')

@app.route('/api/samples', methods=['GET'])
def get_samples():
    return jsonify({
        'status': 'success',
        'crop': 'Wheat (Triticum)',
        'samples': WHEAT_SAMPLES_METADATA
    })

@app.route('/api/taxonomy', methods=['GET'])
def get_taxonomy():
    return jsonify({
        'status': 'success',
        'taxonomy': WHEAT_TAXONOMY
    })

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    return jsonify({
        'status': 'success',
        'diseases': WHEAT_DISEASES_DB
    })

@app.route('/api/network-info', methods=['GET'])
def network_info():
    ip = get_local_ip()
    port = int(os.environ.get('PORT', 5000))
    local_url = f"http://{ip}:{port}"
    
    public_url = tunnel.get_public_url()

    forwarded_proto = request.headers.get('X-Forwarded-Proto', request.scheme)
    forwarded_host = request.headers.get('X-Forwarded-Host', request.host)
    if forwarded_host and not any(forwarded_host.startswith(prefix) for prefix in ['127.0.0.1', 'localhost', '192.168.', '10.', '172.']):
        detected_origin = f"{forwarded_proto}://{forwarded_host}"
        if not public_url:
            public_url = detected_origin

    return jsonify({
        'status': 'success',
        'local_ip': ip,
        'port': port,
        'local_url': local_url,
        'public_url': public_url,
        'mobile_url': public_url if public_url else local_url,
        'is_public_active': bool(public_url)
    })

@app.route('/api/start-tunnel', methods=['POST'])
def start_tunnel_api():
    try:
        port = int(os.environ.get('PORT', 5000))
        url = tunnel.get_public_url()
        if not url:
            url = tunnel.start_cloudflare_tunnel(port)
            if not url:
                url = tunnel.start_ssh_pinggy_tunnel(port)
        return jsonify({
            'status': 'success',
            'public_url': url,
            'is_public_active': bool(url)
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/tts', methods=['GET', 'POST'])
def tts_audio():
    try:
        if request.method == 'POST' and request.is_json:
            data = request.get_json()
            text = data.get('text', '')
            lang = data.get('lang', 'hi')
        else:
            text = request.args.get('text', '')
            lang = request.args.get('lang', 'hi')

        if not text:
            return jsonify({'status': 'error', 'message': 'No text provided for TTS.'}), 400

        target_lang = TTS_LANG_MAP.get(lang, 'hi')
        tts = gTTS(text=text, lang=target_lang, slow=False)
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)

        return Response(buf.read(), mimetype='audio/mpeg')
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        image_data = None
        lang = request.form.get('lang', 'hi')
        wheat_type = request.form.get('wheat_type', 'breadWheat')

        if 'image' in request.files:
            file = request.files['image']
            image_data = file.read()
        elif request.is_json:
            data = request.get_json()
            image_data = data.get('image')
            lang = data.get('lang', lang)
            wheat_type = data.get('wheat_type', wheat_type)
        elif 'image' in request.form:
            image_data = request.form.get('image')

        if not image_data:
            return jsonify({'status': 'error', 'message': 'No wheat leaf image provided.'}), 400

        result = analyze_wheat_leaf_image(image_data, wheat_type=wheat_type)
        if result.get('status') == 'error':
            result['selectedLang'] = lang
            return jsonify(result), 200

        result['status'] = 'success'
        result['selectedLang'] = lang
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    is_online = '--online' in sys.argv or '--public' in sys.argv or os.environ.get('ONLINE_MODE') == '1'

    print("=" * 65)
    print("      WHEAT DOCTOR PROTOTYPE (गेहूं डॉक्टर - EN/HI)")
    print("=" * 65)
    print(f" [Local Access]    http://127.0.0.1:{port}")
    ip = get_local_ip()
    print(f" [Same Wi-Fi LAN]  http://{ip}:{port}")
    
    if is_online:
        print(" [Global Access]   Starting Public Internet HTTPS tunnel...")
        tunnel.start_tunnel_async(port)
    else:
        print(" [Global Access]   To enable worldwide access from ANY network,")
        print("                   run: python app.py --online")
    print("=" * 65)

    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
