import os
from model import analyze_wheat_leaf_image

samples_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'samples')
for fname in sorted(os.listdir(samples_dir)):
    if fname.startswith('wheat_') and fname.endswith('.jpg'):
        path = os.path.join(samples_dir, fname)
        res = analyze_wheat_leaf_image(path)
        print(f"{fname} => Disease: {res['diseaseKey']}, Severity: {res['severity']}, Conf: {res['confidence']}%, Affected: {res['affectedPercentage']}%")
