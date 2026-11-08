import os
import urllib.request
import json
import base64

base_url = "http://127.0.0.1:5000"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("--- 1. Testing GET / ---")
with urllib.request.urlopen(f"{base_url}/") as response:
    html = response.read().decode('utf-8')
    assert "Wheat Doctor" in html
    assert "screen-lang" in html
    assert "screen-capture" in html
    assert "screen-scan" in html
    assert "screen-result" in html
    print(f"OK (HTML length: {len(html)} chars)")

print("\n--- 2. Testing GET /api/samples ---")
with urllib.request.urlopen(f"{base_url}/api/samples") as response:
    data = json.loads(response.read().decode('utf-8'))
    assert data['status'] == 'success'
    assert len(data['samples']) == 5
    print(f"OK (Found {len(data['samples'])} samples: {[s['id'] for s in data['samples']]})")

print("\n--- 3. Testing GET /api/diseases ---")
with urllib.request.urlopen(f"{base_url}/api/diseases") as response:
    data = json.loads(response.read().decode('utf-8'))
    assert data['status'] == 'success'
    assert 'stripeRust' in data['diseases']
    assert 'healthyWheat' in data['diseases']
    print(f"OK (Found diseases: {list(data['diseases'].keys())})")

print("\n--- 4. Testing POST /api/analyze on all wheat sample leaves ---")
samples = ['wheat_healthy.jpg', 'wheat_stripe_rust.jpg', 'wheat_leaf_rust.jpg', 'wheat_powdery_mildew.jpg', 'wheat_septoria_blotch.jpg']
for sample_file in samples:
    sample_path = os.path.join(BASE_DIR, "static", "samples", sample_file)
    with open(sample_path, 'rb') as f:
        img_bytes = f.read()
        b64 = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode('utf-8')
        
    req = urllib.request.Request(
        f"{base_url}/api/analyze",
        data=json.dumps({"image": b64, "lang": "en"}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        assert res['status'] == 'success'
        assert 'diseaseKey' in res
        assert 'severity' in res
        assert 'heatmapOverlayUrl' in res
        print(f"-> {sample_file:25s}: Disease={res['diseaseKey']:14s} Severity={res['severity']:10s} Conf={res['confidence']}% Area={res['affectedPercentage']}%")

print("\n--- 5. Testing Static Assets ---")
for asset in ['/static/style.css', '/static/app.js', '/static/samples/wheat_healthy.jpg']:
    with urllib.request.urlopen(f"{base_url}{asset}") as resp:
        content = resp.read()
        print(f"OK {asset} ({len(content)} bytes)")

print("\n ALL VERIFICATIONS PASSED SUCCESSFULLY!")
