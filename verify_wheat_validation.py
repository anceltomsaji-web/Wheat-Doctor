import os
import sys
import io
import json

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from model import analyze_wheat_leaf_image
from app import app

def test_root_validation():
    print("=" * 60)
    print("   WHEAT DOCTOR ROOT APP - LEAF VALIDATION SUITE")
    print("=" * 60)
    
    samples_dir = "static/samples"
    client = app.test_client()

    print("\n--- 1. Testing Valid Wheat Leaf Acceptance ---")
    wheat_samples = [
        "wheat_healthy.jpg",
        "wheat_stripe_rust.jpg",
        "wheat_leaf_rust.jpg",
        "wheat_powdery_mildew.jpg",
        "wheat_septoria_blotch.jpg"
    ]
    for filename in wheat_samples:
        filepath = os.path.join(samples_dir, filename)
        with open(filepath, "rb") as f:
            img_bytes = f.read()
        res = analyze_wheat_leaf_image(img_bytes)
        assert res.get('status') != 'error'
        assert res.get('diseaseKey') is not None
        print(f" [PASS] Accepted Wheat leaf: {filename:<25} -> Disease: {res.get('diseaseKey')}")

    print("\n--- 2. Testing Non-Wheat Leaf Rejection ---")
    non_wheat_samples = [
        "early_blight.jpg",
        "healthy.jpg",
        "late_blight.jpg",
        "leaf_spot.jpg",
        "powdery_mildew.jpg"
    ]
    for filename in non_wheat_samples:
        filepath = os.path.join(samples_dir, filename)
        with open(filepath, "rb") as f:
            img_bytes = f.read()
        res = analyze_wheat_leaf_image(img_bytes)
        assert res.get('status') == 'error'
        assert res.get('error_type') == 'NOT_WHEAT_LEAF'
        assert res.get('is_wheat_leaf') is False
        print(f" [PASS] Rejected Non-Wheat sample: {filename:<20} -> Message: {res.get('message')[:40]}...")

    print("\n--- 3. Testing Flask /api/analyze rejection endpoint ---")
    with open(os.path.join(samples_dir, "early_blight.jpg"), "rb") as f:
        img_bytes = f.read()
    res = client.post('/api/analyze', data={'image': (io.BytesIO(img_bytes), 'leaf.jpg'), 'lang': 'hi'})
    data = res.get_json()
    assert data.get('status') == 'error' or data.get('error_type') == 'NOT_WHEAT_LEAF'
    assert data.get('is_wheat_leaf') is False
    print(f" [PASS] /api/analyze rejected non-wheat leaf gracefully with error_type='{data.get('error_type')}'")

    print("\n" + "=" * 60)
    print(" [SUCCESS] ALL ROOT APP VALIDATIONS PASSED (100% OK)")
    print("=" * 60)

if __name__ == '__main__':
    test_root_validation()
