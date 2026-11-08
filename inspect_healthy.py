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

img = Image.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'samples', 'wheat_healthy.jpg')).resize((50, 50))
for y in range(50):
    for x in range(50):
        r, g, b = img.getpixel((x, y))
        h, s, v = rgb_to_hsv(r, g, b)
        if y == 25 and x % 5 == 0:
            print(f"x={x}, y={y} RGB=({r},{g},{b}) HSV=({h:.1f}, {s:.2f}, {v:.2f})")
