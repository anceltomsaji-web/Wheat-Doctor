import os
import urllib.request
import json
import base64

base_url = "http://127.0.0.1:5000"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("--- 1. Testing GET / (Wheat Doctor UI) ---")
with urllib.request.urlopen(f"{base_url}/") as response:
    html = response.read().decode('utf-8')
    assert "Wheat Doctor" in html
    assert "Poaceae" in html
    assert "Triticum" in html
    assert "lang-grid-container" in html
    print(f"OK (HTML length: {len(html)} chars)")

print("\n--- 2. Testing GET /api/samples ---")
with urllib.request.urlopen(f"{base_url}/api/samples") as response:
    data = json.loads(response.read().decode('utf-8'))
    assert data['status'] == 'success'
    assert data['crop'] == 'Wheat (Triticum)'
    assert len(data['samples']) == 5
    print(f"OK (Found {len(data['samples'])} wheat samples: {[s['id'] for s in data['samples']]})")

print("\n--- 3. Testing GET /api/taxonomy ---")
with urllib.request.urlopen(f"{base_url}/api/taxonomy") as response:
    data = json.loads(response.read().decode('utf-8'))
    assert data['status'] == 'success'
    taxo = data['taxonomy']
    assert taxo['family']['scientific'] == 'Poaceae (Gramineae)'
    assert taxo['genus'] == 'Triticum'
    assert 'breadWheat' in taxo['speciesTypes']
    assert 'durumWheat' in taxo['speciesTypes']
    assert 'emmerWheat' in taxo['speciesTypes']
    print(f"OK (Taxonomy: Family={taxo['family']['scientific']}, Genus={taxo['genus']}, Cultivars={list(taxo['speciesTypes'].keys())})")

print("\n--- 4. Testing POST /api/analyze across Indian Languages & Cultivars ---")
test_cases = [
    ('wheat_healthy.jpg', 'hi', 'breadWheat', 'healthyWheat'),
    ('wheat_stripe_rust.jpg', 'pa', 'breadWheat', 'stripeRust'),
    ('wheat_leaf_rust.jpg', 'mr', 'durumWheat', 'leafRust'),
    ('wheat_powdery_mildew.jpg', 'gu', 'breadWheat', 'powderyMildew'),
    ('wheat_septoria_blotch.jpg', 'bn', 'emmerWheat', 'septoriaBlotch')
]

for sample_file, lang, wheat_type, expected_disease in test_cases:
    sample_path = os.path.join(BASE_DIR, "static", "samples", sample_file)
    with open(sample_path, 'rb') as f:
        img_bytes = f.read()
        b64 = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode('utf-8')
        
    req = urllib.request.Request(
        f"{base_url}/api/analyze",
        data=json.dumps({"image": b64, "lang": lang, "wheat_type": wheat_type}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        assert res['status'] == 'success'
        assert res['diseaseKey'] == expected_disease
        assert 'taxonomy' in res
        assert 'family' in res['taxonomy']
        assert 'identifiedType' in res['taxonomy']
        print(f"-> {sample_file:26s} (Lang: {lang:2s} | Type: {wheat_type:10s}) => Disease={res['diseaseKey']:14s} Family={res['taxonomy']['family']['scientific']} Conf={res['confidence']}%")

print("\n ALL WHEAT DOCTOR INDIAN MULTI-LINGUAL VERIFICATIONS PASSED SUCCESSFULLY!")
