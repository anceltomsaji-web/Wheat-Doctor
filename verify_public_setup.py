import os
import sys
import time
import requests
import threading

def run_tests():
    # Wait for server to start
    print("[Test] Testing server endpoints...")
    base_url = "http://127.0.0.1:5000"
    
    # 1. Test index page
    r = requests.get(f"{base_url}/", timeout=5)
    assert r.status_code == 200, f"Index failed: {r.status_code}"
    print("  [OK] Index page returns 200 OK")
    
    # 2. Test network info
    r = requests.get(f"{base_url}/api/network-info", timeout=5)
    assert r.status_code == 200, f"Network info failed: {r.status_code}"
    data = r.json()
    print("  [OK] Network info response:", data)
    assert 'local_ip' in data
    assert 'local_url' in data
    
    # 3. Test taxonomy & diseases API
    r = requests.get(f"{base_url}/api/taxonomy", timeout=5)
    assert r.status_code == 200
    print("  [OK] Taxonomy API OK")
    
    # 4. Test sample image analyze API
    sample_path = os.path.join(os.path.dirname(__file__), "static", "samples", "wheat_stripe_rust.jpg")
    if os.path.exists(sample_path):
        with open(sample_path, 'rb') as f:
            files = {'image': ('wheat_stripe_rust.jpg', f, 'image/jpeg')}
            r = requests.post(f"{base_url}/api/analyze", files=files, data={'lang': 'hi', 'wheat_type': 'breadWheat'}, timeout=10)
            assert r.status_code == 200
            res = r.json()
            assert res.get('status') == 'success'
            print("  [OK] Leaf scan analysis OK -> Primary disease:", res.get('diseaseKey'), f"({res.get('confidence')}%)")
    
    print("\nAll endpoints verified successfully!")

if __name__ == '__main__':
    from app import app
    import threading
    
    # Start server in thread
    t = threading.Thread(target=lambda: app.run(port=5000, debug=False, use_reloader=False), daemon=True)
    t.start()
    time.sleep(2)
    
    run_tests()
