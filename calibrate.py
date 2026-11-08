import os
from PIL import Image

samples_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'samples')
for fname in os.listdir(samples_dir):
    if fname.endswith('.jpg'):
        path = os.path.join(samples_dir, fname)
        img = Image.open(path).convert('RGB').resize((100, 100))
        pixels = list(img.getdata())
        greens, yellows, darks, pales = 0, 0, 0, 0
        for r, g, b in pixels:
            # Green check
            if g > r * 1.08 and g > b * 1.08 and g > 40:
                greens += 1
            elif (r > g and r > b) and (r > 80) and (g > 40):
                yellows += 1
            elif r < 55 and g < 55 and b < 55:
                darks += 1
            elif (r > 160 and g > 160 and b > 160) and abs(r-g) < 25 and abs(g-b) < 25:
                pales += 1
        total = len(pixels)
        print(f"{fname:20s}: Green={greens/total*100:.1f}%, Yellow/Brown={yellows/total*100:.1f}%, Dark={darks/total*100:.1f}%, Pale={pales/total*100:.1f}%")
