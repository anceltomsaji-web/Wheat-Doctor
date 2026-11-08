import os
import sys
import io
import json

# Add prototype directory to sys.path
PROTOTYPE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, PROTOTYPE_DIR)
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from model import analyze_wheat_leaf_image, WHEAT_DISEASES_DB, WHEAT_TAXONOMY
from app import app

def test_model_diagnostics():
    print("\n--- 1. Testing Botanical Model Diagnostics on Calibrated Samples ---")
    samples_dir = os.path.join(PROTOTYPE_DIR, "static", "samples")
    
    test_cases = [
        ("wheat_healthy.jpg", "healthyWheat", "breadWheat"),
        ("wheat_stripe_rust.jpg", "stripeRust", "breadWheat"),
        ("wheat_leaf_rust.jpg", "leafRust", "breadWheat"),
        ("wheat_powdery_mildew.jpg", "powderyMildew", "breadWheat"),
        ("wheat_septoria_blotch.jpg", "septoriaBlotch", "breadWheat")
    ]
    
    for filename, expected_disease, wheat_type in test_cases:
        filepath = os.path.join(samples_dir, filename)
        assert os.path.exists(filepath), f"Sample image {filename} missing at {filepath}"
        
        with open(filepath, "rb") as f:
            img_bytes = f.read()
            
        result = analyze_wheat_leaf_image(img_bytes, wheat_type=wheat_type)
        assert result['diseaseKey'] == expected_disease, f"Expected {expected_disease}, got {result['diseaseKey']} for {filename}"
        assert result['confidence'] >= 85.0, f"Confidence too low: {result['confidence']}"
        assert result['heatmapOverlayUrl'].startswith("data:image/png;base64,"), "Invalid heatmap PNG base64"
        assert result['annotatedImageUrl'].startswith("data:image/jpeg;base64,"), "Invalid annotated image base64"
        
        disease_en = result['diseaseData']['en']['name']
        disease_hi = result['diseaseData']['hi']['name']
        print(f" [PASS] {filename:<26} -> {result['diseaseKey']:<15} ({result['confidence']}% conf) | EN: {disease_en[:25]}... | HI: {disease_hi[:25]}...")

def test_bilingual_coverage():
    print("\n--- 2. Testing English & Hindi Database Completeness ---")
    for key, d in WHEAT_DISEASES_DB.items():
        assert 'en' in d, f"Missing English entry in disease {key}"
        assert 'hi' in d, f"Missing Hindi entry in disease {key}"
        
        # Check essential fields in English
        for field in ['name', 'scientific', 'status', 'summary', 'organic', 'chemical', 'dosage', 'prevention']:
            assert field in d['en'], f"Missing EN field '{field}' in {key}"
            assert field in d['hi'], f"Missing HI field '{field}' in {key}"
        print(f" [PASS] Disease '{key}' has complete EN and HI medical prescriptions.")

    # Check taxonomy
    for type_key, species in WHEAT_TAXONOMY['speciesTypes'].items():
        assert 'en' in species['name'] and 'hi' in species['name']
        assert 'en' in species['endUse'] and 'hi' in species['endUse']
        print(f" [PASS] Cultivar '{type_key}' ({species['scientific']}) has complete EN and HI taxonomy.")

def test_flask_endpoints():
    print("\n--- 3. Testing Flask API Endpoints ---")
    client = app.test_client()

    # GET /
    res = client.get('/')
    assert res.status_code == 200, f"GET / failed with {res.status_code}"
    assert b"Wheat Doctor" in res.data
    print(" [PASS] GET / -> HTTP 200 (Index HTML served)")

    # GET /api/samples
    res = client.get('/api/samples')
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'success'
    assert len(data['samples']) == 5
    print(f" [PASS] GET /api/samples -> HTTP 200 ({len(data['samples'])} samples metadata)")

    # GET /api/taxonomy
    res = client.get('/api/taxonomy')
    assert res.status_code == 200
    data = res.get_json()
    assert 'family' in data['taxonomy']
    print(" [PASS] GET /api/taxonomy -> HTTP 200")

    # GET /api/diseases
    res = client.get('/api/diseases')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data['diseases']) >= 5
    print(f" [PASS] GET /api/diseases -> HTTP 200 ({len(data['diseases'])} diseases)")

    # GET /api/network-info
    res = client.get('/api/network-info')
    assert res.status_code == 200
    data = res.get_json()
    assert 'local_ip' in data
    print(f" [PASS] GET /api/network-info -> HTTP 200 (IP: {data['local_ip']})")

    # POST /api/analyze
    sample_path = os.path.join(PROTOTYPE_DIR, "static", "samples", "wheat_stripe_rust.jpg")
    with open(sample_path, "rb") as f:
        img_bytes = f.read()
    res = client.post('/api/analyze', data={'image': (io.BytesIO(img_bytes), 'leaf.jpg'), 'lang': 'hi', 'wheat_type': 'breadWheat'})
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'success'
    assert data['diseaseKey'] == 'stripeRust'
    assert data['selectedLang'] == 'hi'
    print(" [PASS] POST /api/analyze -> HTTP 200 (Disease analysis & Heatmaps OK)")

    # GET /api/tts (Hindi & English)
    res_hi = client.get('/api/tts?lang=hi&text=' + json.dumps("पीला रतुआ"))
    assert res_hi.status_code == 200, f"TTS Hindi failed: {res_hi.status_code}"
    assert res_hi.mimetype == 'audio/mpeg'
    print(f" [PASS] GET /api/tts (Hindi) -> HTTP 200 ({len(res_hi.data)} bytes audio/mpeg)")

    res_en = client.get('/api/tts?lang=en&text=' + json.dumps("Stripe Rust"))
    assert res_en.status_code == 200, f"TTS English failed: {res_en.status_code}"
    assert res_en.mimetype == 'audio/mpeg'
    print(f" [PASS] GET /api/tts (English) -> HTTP 200 ({len(res_en.data)} bytes audio/mpeg)")

def test_non_wheat_rejection():
    print("\n--- 4. Testing Rejection of Non-Wheat Leaves & Non-Plant Images ---")
    samples_dir = os.path.join(PROTOTYPE_DIR, "static", "samples")
    client = app.test_client()

    non_wheat_samples = [
        "early_blight.jpg",
        "healthy.jpg",
        "late_blight.jpg",
        "leaf_spot.jpg",
        "powdery_mildew.jpg"
    ]

    for filename in non_wheat_samples:
        filepath = os.path.join(samples_dir, filename)
        if not os.path.exists(filepath):
            continue
        with open(filepath, "rb") as f:
            img_bytes = f.read()

        # Model direct test
        res_model = analyze_wheat_leaf_image(img_bytes)
        assert res_model.get('status') == 'error', f"Model failed to reject non-wheat leaf: {filename}"
        assert res_model.get('is_wheat_leaf') is False
        assert res_model.get('error_type') == 'NOT_WHEAT_LEAF'
        assert 'message' in res_model and 'message_hi' in res_model

        # Flask endpoint test
        res_api = client.post('/api/analyze', data={'image': (io.BytesIO(img_bytes), 'leaf.jpg'), 'lang': 'hi'})
        data = res_api.get_json()
        assert data.get('status') == 'error' or data.get('error_type') == 'NOT_WHEAT_LEAF'
        assert data.get('is_wheat_leaf') is False
        print(f" [PASS] Rejected non-wheat sample: {filename:<22} -> Reason: {data.get('message')[:40]}...")

    # Test blank / non-plant image rejection
    from PIL import Image
    blank_img = Image.new('RGB', (100, 100), color=(255, 255, 255))
    buf = io.BytesIO()
    blank_img.save(buf, format='JPEG')
    blank_bytes = buf.getvalue()

    res_blank = analyze_wheat_leaf_image(blank_bytes)
    assert res_blank.get('status') == 'error'
    assert res_blank.get('error_type') == 'NON_PLANT'
    print(f" [PASS] Rejected blank non-plant image -> Error: {res_blank.get('error_type')}")

if __name__ == '__main__':
    print("=" * 60)
    print("   WHEAT DOCTOR PROTOTYPE (EN/HI) - VERIFICATION SUITE")
    print("=" * 60)
    try:
        test_model_diagnostics()
        test_bilingual_coverage()
        test_flask_endpoints()
        test_non_wheat_rejection()
        print("\n" + "=" * 60)
        print(" [SUCCESS] ALL PROTOTYPE TESTS PASSED (100% OK)")
        print("=" * 60)
    except AssertionError as e:
        print(f"\n [ERROR] Verification failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n [ERROR] Unexpected exception during verification: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
