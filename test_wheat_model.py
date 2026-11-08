import os
from model import analyze_wheat_leaf_image

samples = [
    'wheat_healthy.jpg',
    'wheat_stripe_rust.jpg',
    'wheat_leaf_rust.jpg',
    'wheat_powdery_mildew.jpg',
    'wheat_septoria_blotch.jpg'
]

samples_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'samples')
for fname in samples:
    path = os.path.join(samples_dir, fname)
    res = analyze_wheat_leaf_image(path, wheat_type='breadWheat')
    print(f"{fname:26s} => Disease: {res['diseaseKey']:16s} Severity: {res['severity']:10s} Conf: {res['confidence']}% Affected: {res['affectedPercentage']}%")
