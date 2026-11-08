import os
from PIL import Image, ImageFilter

def rgb_to_hsv(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    mx = max(r, g, b)
    mn = min(r, g, b)
    df = mx - mn
    if mx == mn: h = 0
    elif mx == r: h = (60 * ((g - b) / df) + 360) % 360
    elif mx == g: h = (60 * ((b - r) / df) + 120) % 360
    elif mx == b: h = (60 * ((r - g) / df) + 240) % 360
    s = 0 if mx == 0 else (df / mx)
    return h, s, mx

def test_classifier(img_path):
    img = Image.open(img_path).convert('RGB').resize((120, 120))
    pixels = img.load()
    
    leaf_pixels = 0
    green_pixels = 0
    pale_mildew = 0
    dark_decay = 0
    early_target_spot = 0
    cercospora_spot = 0
    
    # Calculate local gradient for spot detection
    gray = img.convert('L')
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edge_px = edges.load()

    for y in range(120):
        for x in range(120):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)
            
            # Identify if it is part of the leaf/canopy vs background
            is_green = (g >= r * 1.05 and g >= b * 1.05) or (h >= 62 and h <= 170 and s > 0.18)
            is_pale = (s < 0.25 and v > 0.55 and abs(r - g) < 25 and abs(g - b) < 25 and (r > 120 or g > 120))
            is_dark_decay = (v < 0.22) or (h >= 10 and h <= 55 and v < 0.32 and (r > b))
            is_yellow_halo = (h >= 35 and h <= 62 and s > 0.55 and v > 0.45)
            is_brown_lesion = (h >= 15 and h < 38 and s > 0.25 and v > 0.18 and r > b)
            
            # Check edge intensity for spot sharpness
            ed = edge_px[x, y]
            
            if is_green:
                green_pixels += 1
                leaf_pixels += 1
            elif is_pale:
                pale_mildew += 1
                leaf_pixels += 1
            elif is_dark_decay:
                dark_decay += 1
                leaf_pixels += 1
            elif is_yellow_halo or is_brown_lesion:
                if is_yellow_halo:
                    early_target_spot += 1
                else:
                    if ed > 30:
                        cercospora_spot += 1
                    else:
                        early_target_spot += 1
                leaf_pixels += 1

    if leaf_pixels == 0: leaf_pixels = 1
    
    total_diseased = pale_mildew + dark_decay + early_target_spot + cercospora_spot
    disease_ratio = total_diseased / float(leaf_pixels)
    
    print(f"{os.path.basename(img_path):18s}: Leaf={leaf_pixels}, Green={green_pixels}, Pale={pale_mildew}, Dark={dark_decay}, EarlyHalo={early_target_spot}, Spot={cercospora_spot}, Ratio={disease_ratio:.3f}")
    
    if disease_ratio < 0.04:
        return 'healthy', 'healthy', round(disease_ratio * 100, 1)
    
    if pale_mildew > total_diseased * 0.45 and pale_mildew > leaf_pixels * 0.05:
        key = 'powderyMildew'
    elif dark_decay > total_diseased * 0.30 and dark_decay > leaf_pixels * 0.05:
        key = 'lateBlight'
    elif early_target_spot > cercospora_spot:
        key = 'earlyBlight'
    elif cercospora_spot >= early_target_spot:
        key = 'leafSpot'
    else:
        key = 'earlyBlight'
        
    sev = 'mild' if disease_ratio < 0.12 else ('moderate' if disease_ratio < 0.30 else 'severe')
    return key, sev, round(disease_ratio * 100, 1)

samples_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'samples')
for f in os.listdir(samples_dir):
    if f.endswith('.jpg'):
        p = os.path.join(samples_dir, f)
        k, s, r = test_classifier(p)
        print(f"--> RESULT: {f} => {k} ({s}) [Affected: {r}%]\n")
