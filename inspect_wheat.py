import os
from PIL import Image

def rgb_to_hsv(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    mx = max(r, g, b)
    mn = min(r, g, b)
    df = mx - mn
    h = 0
    if mx == mn: h = 0
    elif mx == r: h = (60 * ((g - b) / df) + 360) % 360
    elif mx == g: h = (60 * ((b - r) / df) + 120) % 360
    elif mx == b: h = (60 * ((r - g) / df) + 240) % 360
    s = 0 if mx == 0 else (df / mx)
    return h, s, mx

def profile_wheat_sample(path):
    img = Image.open(path).convert('RGB').resize((100, 100))
    pixels = img.load()
    yellow_stripe, brown_rust, pycnidia_black, tan_blotch = 0, 0, 0, 0
    for y in range(100):
        for x in range(100):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)
            if r < 45 and g < 45 and b < 45:
                pycnidia_black += 1
            elif h >= 10 and h < 34 and s > 0.35 and r > b * 1.3:
                brown_rust += 1
            elif h >= 36 and h <= 58 and s > 0.55 and v > 0.50:
                yellow_stripe += 1
            elif h >= 25 and h < 55 and s > 0.20 and v > 0.35:
                tan_blotch += 1
    print(f"{path}: PycnidiaBlack={pycnidia_black}, BrownRust={brown_rust}, YellowStripe={yellow_stripe}, TanBlotch={tan_blotch}")

BASE_SAMPLES = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'samples')
profile_wheat_sample(os.path.join(BASE_SAMPLES, 'wheat_leaf_rust.jpg'))
profile_wheat_sample(os.path.join(BASE_SAMPLES, 'wheat_septoria_blotch.jpg'))
profile_wheat_sample(os.path.join(BASE_SAMPLES, 'wheat_stripe_rust.jpg'))
