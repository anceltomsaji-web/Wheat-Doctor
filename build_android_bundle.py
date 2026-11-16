"""
Wheat Doctor — Android APK & GitHub Pages Static Bundle Builder
================================================================
Generates:
1. High-resolution App Icons (PWA 192x192, 512x512, Apple Touch Icon, Favicon)
2. Android Adaptive & Mipmap Launcher Icons (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
3. Client-Side On-Device Computer Vision Engine (`static/vision_engine.js` & `prototype/static/vision_engine.js`)
   porting the exact mathematical algorithms from `model.py` (`validate_wheat_leaf_image` & `analyze_wheat_leaf_image`)
   plus the complete 12-language `WHEAT_TAXONOMY` and `WHEAT_DISEASES_DB`.
4. PWA Web App Manifest (`manifest.json`) & Offline Service Worker (`sw.js`).
5. Self-contained Static Bundles in `dist/` (for GitHub Pages) and `android/app/src/main/assets/www/` (for Android APK).
"""

import os
import json
import shutil
from PIL import Image, ImageDraw

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

from model import WHEAT_TAXONOMY, WHEAT_DISEASES_DB
from app import WHEAT_SAMPLES_METADATA
from prototype.model import WHEAT_TAXONOMY as PROTO_TAXONOMY, WHEAT_DISEASES_DB as PROTO_DISEASES_DB

# Ensure root WHEAT_DISEASES_DB includes resistantVarieties from prototype
for d_key, d_val in WHEAT_DISEASES_DB.items():
    if 'resistantVarieties' not in d_val and d_key in PROTO_DISEASES_DB:
        d_val['resistantVarieties'] = PROTO_DISEASES_DB[d_key].get('resistantVarieties', [])


def create_wheat_app_icon(size=512, round_mask=False):
    """Generates a botanical golden-emerald Wheat Doctor icon of the given size."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background gradient-like nested rounded rectangles / circle
    margin = int(size * 0.04) if round_mask else 0
    radius = (size // 2) if round_mask else int(size * 0.22)

    # Deep emerald base (#07140E -> #0D2818)
    draw.rounded_rectangle(
        [margin, margin, size - margin - 1, size - margin - 1],
        radius=radius,
        fill=(10, 34, 22, 255),
        outline=(212, 163, 56, 220),
        width=max(2, int(size * 0.035))
    )

    # Inner golden halo ring
    inner_m = int(size * 0.12)
    draw.ellipse(
        [inner_m, inner_m, size - inner_m, size - inner_m],
        fill=(16, 48, 31, 255),
        outline=(234, 179, 8, 110),
        width=max(1, int(size * 0.015))
    )

    cx = size // 2
    # Draw stylized golden wheat stalk
    stem_top = int(size * 0.24)
    stem_bottom = int(size * 0.80)
    stem_w = max(2, int(size * 0.035))
    draw.line([(cx, stem_top), (cx, stem_bottom)], fill=(245, 194, 66, 255), width=stem_w)

    # Draw 5 pairs of wheat spikelets (grains) along the stalk
    grain_levels = [0.64, 0.54, 0.44, 0.34, 0.26]
    grain_w = int(size * 0.095)
    grain_h = int(size * 0.055)

    for lvl in grain_levels:
        y = int(size * lvl)
        # Left spikelet
        lx1, ly1 = cx - int(size * 0.03) - grain_w, y - grain_h
        lx2, ly2 = cx - int(size * 0.02), y + grain_h
        draw.ellipse([lx1, ly1, lx2, ly2], fill=(250, 204, 21, 255), outline=(202, 138, 4, 255), width=max(1, size // 128))
        # Awns (whiskers)
        draw.line([(lx1, ly1), (lx1 - int(size * 0.04), ly1 - int(size * 0.05))], fill=(253, 224, 71, 200), width=max(1, size // 140))

        # Right spikelet
        rx1, ry1 = cx + int(size * 0.02), y - grain_h
        rx2, ry2 = cx + int(size * 0.03) + grain_w, y + grain_h
        draw.ellipse([rx1, ry1, rx2, ry2], fill=(250, 204, 21, 255), outline=(202, 138, 4, 255), width=max(1, size // 128))
        draw.line([(rx2, ry1), (rx2 + int(size * 0.04), ry1 - int(size * 0.05))], fill=(253, 224, 71, 200), width=max(1, size // 140))

    # Top central grain
    ty = int(size * 0.19)
    draw.ellipse(
        [cx - int(size * 0.04), ty - int(size * 0.05), cx + int(size * 0.04), ty + int(size * 0.05)],
        fill=(253, 224, 71, 255),
        outline=(202, 138, 4, 255),
        width=max(1, size // 128)
    )

    # Green basal leaves
    draw.arc(
        [cx - int(size * 0.26), int(size * 0.56), cx, int(size * 0.84)],
        start=180, end=340, fill=(34, 197, 94, 255), width=max(2, int(size * 0.032))
    )
    draw.arc(
        [cx, int(size * 0.56), cx + int(size * 0.26), int(size * 0.84)],
        start=200, end=360, fill=(34, 197, 94, 255), width=max(2, int(size * 0.032))
    )

    return img


def generate_all_icons():
    print("[1/5] Generating PWA & Android Launcher Icons...")
    for static_dir in [os.path.join(BASE_DIR, "static", "icons"), os.path.join(BASE_DIR, "prototype", "static", "icons")]:
        os.makedirs(static_dir, exist_ok=True)
        create_wheat_app_icon(512).save(os.path.join(static_dir, "icon-512.png"), "PNG")
        create_wheat_app_icon(192).save(os.path.join(static_dir, "icon-192.png"), "PNG")
        create_wheat_app_icon(180).save(os.path.join(static_dir, "apple-touch-icon.png"), "PNG")
        create_wheat_app_icon(64).save(os.path.join(static_dir, "favicon.png"), "PNG")

    # Android mipmap icons
    mipmaps = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    res_dir = os.path.join(BASE_DIR, "android", "app", "src", "main", "res")
    for folder, px in mipmaps.items():
        target_dir = os.path.join(res_dir, folder)
        os.makedirs(target_dir, exist_ok=True)
        create_wheat_app_icon(px, round_mask=False).save(os.path.join(target_dir, "ic_launcher.png"), "PNG")
        create_wheat_app_icon(px, round_mask=True).save(os.path.join(target_dir, "ic_launcher_round.png"), "PNG")


VISION_ENGINE_JS_TEMPLATE = """/**
 * Wheat Doctor — Client-Side On-Device AI & Computer Vision Engine (vision_engine.js)
 * ===================================================================================
 * Exact JavaScript/HTML5 Canvas port of `model.py`:
 * 1. `rgbToHsv(r, g, b)` — Non-linear RGB to Hue-Saturation-Value transformation
 * 2. `computeFindEdges(rgba, w, h)` — 3x3 Laplacian High-Pass Edge Filter `[-1,-1,-1,-1,8,-1,-1,-1,-1]`
 * 3. `validateWheatLeafImage(imgElement)` — 120x120 Poaceae Monocot vs Broadleaf Dicot Validator:
 *    - 18-bin Sobel Directional Gradient Orientation Histogram (`peak_ratio`)
 *    - 1D Spatial Green-Channel Projection Variance Ratio (`profile_ratio`)
 *    - 6-Stage Non-Plant & Broadleaf Dicot Rejection Gates
 * 4. `analyze(imageSource, wheatType, lang)` — 220x220 Multi-Spectral Lesion Classifier &
 *    Gaussian-Blurred RGBA Heatmap Overlay Synthesizer.
 *
 * Works 100% offline inside the Native Android APK, Installed PWA, and GitHub Pages.
 */

window.WHEAT_TAXONOMY_DB = __TAXONOMY_JSON__;

window.WHEAT_DISEASES_DATABASE = __DISEASES_JSON__;

window.WHEAT_SAMPLES_LIST = __SAMPLES_JSON__;

class WheatVisionEngine {
  /**
   * Converts 8-bit RGB [0..255] to HSV:
   * H in [0..360), S in [0..1], V in [0..1]
   */
  static rgbToHsv(r, g, b) {
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const df = mx - mn;
    let h = 0;
    if (mx === mn) {
      h = 0;
    } else if (mx === r) {
      h = (60 * ((g - b) / df) + 360) % 360;
    } else if (mx === g) {
      h = (60 * ((b - r) / df) + 120) % 360;
    } else if (mx === b) {
      h = (60 * ((r - g) / df) + 240) % 360;
    }
    const s = mx === 0 ? 0 : (df / mx);
    return [h, s, mx];
  }

  /**
   * Emulates PIL `img.convert('L').filter(ImageFilter.FIND_EDGES)`
   * Kernel: 3x3 Laplacian [-1, -1, -1, -1, 8, -1, -1, -1, -1]
   */
  static computeFindEdges(rgbaData, width, height) {
    const gray = new Uint8Array(width * height);
    for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
      // ITU-R BT.601 luma conversion matching Pillow RGB->L
      gray[i] = (rgbaData[p] * 19595 + rgbaData[p + 1] * 38470 + rgbaData[p + 2] * 7471 + 32768) >> 16;
    }

    const edges = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          edges[y * width + x] = gray[y * width + x];
          continue;
        }
        const idx = y * width + x;
        const val =
          8 * gray[idx] -
          gray[idx - width - 1] - gray[idx - width] - gray[idx - width + 1] -
          gray[idx - 1]         -                     gray[idx + 1] -
          gray[idx + width - 1] - gray[idx + width] - gray[idx + width + 1];
        edges[idx] = val < 0 ? 0 : (val > 255 ? 255 : val);
      }
    }
    return edges;
  }

  /**
   * Loads a DataURL or image URL into an HTMLImageElement
   */
  static loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error('Failed to decode image for vision analysis.'));
      img.src = src;
    });
  }

  /**
   * Validates that the uploaded or camera-captured image belongs to a Wheat plant
   * (Poaceae monocot blade) and strictly rejects non-plant objects and normal broadleaf
   * plants (houseplants, tomato, potato, rose, mango, hibiscus, trees, flowers, etc.).
   */
  static validateWheatLeafImage(imgElement) {
    const size = 120;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(imgElement, 0, 0, size, size);

    const rgba = ctx.getImageData(0, 0, size, size).data;
    const epx = this.computeFindEdges(rgba, size, size);

    let stripe_yellow = 0;
    let brown_rust = 0;
    let powdery_white = 0;
    let septoria_tan = 0;
    let green_px = 0;
    let dark_rot = 0;
    let studio_bg = 0;
    let non_plant_vivid = 0;
    let center_green = 0;
    let border_green = 0;
    let green_h_sum = 0.0;
    let green_h_sq = 0.0;
    let green_s_sum = 0.0;
    let green_v_sum = 0.0;
    let green_e_sum = 0.0;

    const num_bins = 18;
    const hist_r = new Float64Array(num_bins);
    const hist_g = new Float64Array(num_bins);

    const b_jxx = new Float64Array(36);
    const b_jyy = new Float64Array(36);
    const b_jxy = new Float64Array(36);
    const b_gcnt = new Int32Array(36);

    const row_g = new Float64Array(size);
    const col_g = new Float64Array(size);
    let row_trans = 0;
    let col_trans = 0;
    const prev_row_g = new Uint8Array(size);

    const getR = (x, y) => rgba[(y * size + x) * 4];
    const getG = (x, y) => rgba[(y * size + x) * 4 + 1];

    for (let y = 0; y < size; y++) {
      let prev_g_x = 0;
      for (let x = 0; x < size; x++) {
        const pIdx = (y * size + x) * 4;
        const r = rgba[pIdx];
        const g = rgba[pIdx + 1];
        const b = rgba[pIdx + 2];
        row_g[y] += g;
        col_g[x] += g;
        const [h, s, v] = this.rgbToHsv(r, g, b);
        const ev = epx[y * size + x];

        const is_plain_bg = (r > 240 && g > 240 && b > 240) || (r < 20 && g < 20 && b < 20) || (s < 0.04);
        const is_green = (g >= r * 1.05 && g >= b * 1.05 && g > 30) || (h >= 62 && h <= 170 && s > 0.14 && v > 0.12);
        const is_mildew = (!is_plain_bg) && (s < 0.30 && v > 0.45 && Math.abs(r - g) < 28 && Math.abs(g - b) < 28 && (r > 105 || g > 105));
        const is_pycnidia_black = (r < 48 && g < 48 && b < 48 && v < 0.20 && !is_plain_bg);
        const is_stripe_yellow = (h >= 36 && h <= 58 && s > 0.58 && v > 0.48);
        const is_brown_rust = (h >= 12 && h < 35 && s > 0.35 && v > 0.20 && r > b * 1.25);
        const is_septoria_tan = (h >= 22 && h < 55 && s > 0.22 && v > 0.30 && ev > 22);
        const is_dark_rot = (v < 0.25 && r > 30 && g < 50);

        if (!is_green && s < 0.20 && v > 0.26 && v < 0.86 && ev < 38) studio_bg++;
        if ((h < 14 || h > 178) && s > 0.22 && v > 0.22) non_plant_vivid++;

        const g_flag = is_green ? 1 : 0;
        if (x > 0 && g_flag !== prev_g_x) row_trans++;
        prev_g_x = g_flag;
        if (y > 0 && g_flag !== prev_row_g[x]) col_trans++;
        prev_row_g[x] = g_flag;

        if (is_green) {
          green_px++;
          green_h_sum += h;
          green_h_sq += h * h;
          green_s_sum += s;
          green_v_sum += v;
          green_e_sum += ev;
          if (x >= 28 && x < 92 && y >= 28 && y < 92) center_green++;
          if (x < 16 || x >= 104 || y < 16 || y >= 104) border_green++;
        }
        if (is_stripe_yellow) stripe_yellow++;
        if (is_brown_rust) brown_rust++;
        if (is_mildew) powdery_white++;
        if (is_septoria_tan || is_pycnidia_black) septoria_tan++;
        if (is_dark_rot) dark_rot++;

        if (x >= 1 && x < size - 1 && y >= 1 && y < size - 1) {
          const dx = (getR(x + 1, y - 1) + 2 * getR(x + 1, y) + getR(x + 1, y + 1)) -
                     (getR(x - 1, y - 1) + 2 * getR(x - 1, y) + getR(x - 1, y + 1));
          const dy = (getR(x - 1, y + 1) + 2 * getR(x, y + 1) + getR(x + 1, y + 1)) -
                     (getR(x - 1, y - 1) + 2 * getR(x, y - 1) + getR(x + 1, y - 1));
          const mag = Math.sqrt(dx * dx + dy * dy);
          if (mag > 20) {
            const a = ((Math.atan2(dy, dx) % Math.PI) + Math.PI) % Math.PI;
            const bi = Math.floor(a / (Math.PI / num_bins)) % num_bins;
            hist_r[bi] += mag;
          }

          if (is_green) {
            const gdx = (getG(x + 1, y - 1) + 2 * getG(x + 1, y) + getG(x + 1, y + 1)) -
                        (getG(x - 1, y - 1) + 2 * getG(x - 1, y) + getG(x - 1, y + 1));
            const gdy = (getG(x - 1, y + 1) + 2 * getG(x, y + 1) + getG(x + 1, y + 1)) -
                        (getG(x - 1, y - 1) + 2 * getG(x, y - 1) + getG(x + 1, y - 1));
            const gmag = Math.sqrt(gdx * gdx + gdy * gdy);
            if (gmag > 18) {
              const ga = ((Math.atan2(gdy, gdx) % Math.PI) + Math.PI) % Math.PI;
              const gbi = Math.floor(ga / (Math.PI / num_bins)) % num_bins;
              hist_g[gbi] += gmag;
            }
            const bidx = Math.floor(y / 20) * 6 + Math.floor(x / 20);
            b_jxx[bidx] += gdx * gdx;
            b_jyy[bidx] += gdy * gdy;
            b_jxy[bidx] += gdx * gdy;
            b_gcnt[bidx]++;
          }
        }
      }
    }

    let tot_r = 0, max_r = 0, pk_r = 0;
    for (let i = 0; i < num_bins; i++) {
      tot_r += hist_r[i];
      if (hist_r[i] > max_r) { max_r = hist_r[i]; pk_r = i; }
    }
    const peak_ratio = tot_r > 0 ? (max_r / ((tot_r / num_bins) + 1e-5)) : 1.0;
    const cone_r = tot_r > 0
      ? ((hist_r[pk_r] + hist_r[(pk_r + num_bins - 1) % num_bins] + hist_r[(pk_r + 1) % num_bins]) / (tot_r + 1e-5))
      : 0.16;

    let tot_g = 0, max_g = 0, pk_g = 0;
    for (let i = 0; i < num_bins; i++) {
      tot_g += hist_g[i];
      if (hist_g[i] > max_g) { max_g = hist_g[i]; pk_g = i; }
    }
    const peak_ratio_g = tot_g > 0 ? (max_g / ((tot_g / num_bins) + 1e-5)) : 1.0;
    const main_g = hist_g[pk_g] + hist_g[(pk_g + num_bins - 1) % num_bins] + hist_g[(pk_g + 1) % num_bins];
    const cone_g = tot_g > 0 ? (main_g / (tot_g + 1e-5)) : 0.16;
    const diag_g =
      hist_g[(pk_g + num_bins - 4) % num_bins] +
      hist_g[(pk_g + num_bins - 3) % num_bins] +
      hist_g[(pk_g + 3) % num_bins] +
      hist_g[(pk_g + 4) % num_bins];
    const pinnate_ratio = diag_g / (main_g + 1e-5);

    let coh_w_sum = 0, w_sum = 0, high_coh_blocks = 0, active_blocks = 0, c2_sum = 0, s2_sum = 0;
    for (let bi = 0; bi < 36; bi++) {
      if (b_gcnt[bi] < 60) continue;
      const xx = b_jxx[bi], yy = b_jyy[bi], xy = b_jxy[bi];
      const tr = xx + yy;
      if (tr < 500) continue;
      const coh = Math.sqrt((xx - yy) * (xx - yy) + 4.0 * xy * xy) / (tr + 1e-5);
      const ang = 0.5 * Math.atan2(2.0 * xy, xx - yy);
      coh_w_sum += coh * tr;
      w_sum += tr;
      active_blocks++;
      if (coh > 0.56) high_coh_blocks++;
      c2_sum += tr * Math.cos(2.0 * ang);
      s2_sum += tr * Math.sin(2.0 * ang);
    }
    const mean_bcoh = w_sum > 0 ? (coh_w_sum / w_sum) : 0.0;
    const high_coh_frac = active_blocks > 0 ? (high_coh_blocks / active_blocks) : 0.0;
    const ang_agree = w_sum > 0 ? (Math.sqrt(c2_sum * c2_sum + s2_sum * s2_sum) / w_sum) : 0.0;

    let rm_avg = 0, cm_avg = 0;
    for (let i = 0; i < size; i++) {
      row_g[i] /= size;
      col_g[i] /= size;
      rm_avg += row_g[i];
      cm_avg += col_g[i];
    }
    rm_avg /= size;
    cm_avg /= size;
    let row_var = 0, col_var = 0;
    for (let i = 0; i < size; i++) {
      row_var += (row_g[i] - rm_avg) ** 2;
      col_var += (col_g[i] - cm_avg) ** 2;
    }
    row_var /= size;
    col_var /= size;
    const profile_ratio = Math.max(row_var, col_var) / (Math.min(row_var, col_var) + 1e-4);

    const N = size * size;
    const total_foliar = green_px + stripe_yellow + brown_rust + powdery_white + septoria_tan;
    const foliar_pct = total_foliar / N;

    if (foliar_pct < 0.35 || (green_px < 1800 && stripe_yellow < 400) || (non_plant_vivid / N > 0.35)) {
      return {
        isWheat: false,
        errorType: 'NON_PLANT',
        messageEn: 'The uploaded image does not contain recognizable wheat plant foliage.',
        messageHi: 'अपलोड की गई फोटो में गेहूं के पौधे की पत्ती नहीं पाई गई।'
      };
    }

    if (dark_rot > 450 && stripe_yellow < 150 && peak_ratio < 1.3) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image appears to be a broadleaf crop (e.g. Potato/Tomato) with late blight, not a wheat blade.',
        messageHi: 'अपलोड की गई फोटो गेहूं की पत्ती नहीं है (यह आलू/टमाटर जैसी चौड़ी पत्ती वाली फसल है)।'
      };
    }

    if (peak_ratio < 1.30 && stripe_yellow < 50 && profile_ratio < 2.0) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a broadleaf plant with reticulate venation, not a linear wheat leaf blade.',
        messageHi: 'अपलोड की गई फोटो चौड़ी पत्ती वाली फसल की है, गेहूं की पत्ती नहीं है।'
      };
    }

    if (powdery_white > 3500 && peak_ratio < 1.35) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a broadleaf plant affected by non-cereal powdery mildew, not a wheat leaf.',
        messageHi: 'अपलोड की गई फोटो चौड़ी पत्ती की है, गेहूं की पत्ती नहीं है।'
      };
    }

    if (stripe_yellow < 300 && dark_rot > 300 && peak_ratio < 1.45) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image shows concentric circular lesions of a broadleaf plant (Alternaria/Early Blight), not wheat.',
        messageHi: 'अपलोड की गई फोटो में चौड़ी पत्ती के गोल धब्बे हैं, यह गेहूं की पत्ती नहीं है।'
      };
    }

    if (green_px < 13500 && peak_ratio < 2.1 && stripe_yellow < 100 && brown_rust < 100 && septoria_tan < 400 && powdery_white < 500) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a broadleaf plant (Dicot), not a wheat crop leaf (Poaceae).',
        messageHi: 'अपलोड की गई फोटो गेहूं की फसल (पोएसी कुल) की पत्ती नहीं है।'
      };
    }

    const gcnt = Math.max(1, green_px);
    const gh_mean = (green_h_sum / gcnt) / 180.0;
    const gh_var = Math.max(0.0, (green_h_sq / gcnt) - (green_h_sum / gcnt) ** 2);
    const gh_std = Math.sqrt(gh_var) / 50.0;
    const gs_mean = green_s_sum / gcnt;
    const gv_mean = green_v_sum / gcnt;
    const ge_mean = (green_e_sum / gcnt) / 255.0;
    const c_green_frac = center_green / 4096.0;
    const b_green_frac = border_green / 6784.0;

    const weights = [
      2.978174, 11.242965, -6.993803, -1.181372, 1.593047, -35.517831,
      3.158534, -2.410670, 0.546169, 5.498374, 0.609326, -8.396647,
      0.040359, -2.343539, 4.687147, -0.697977, -1.293279, 1.288970,
      -2.260799, 1.311390, 5.540455, -1.327158, -1.364465, 1.645384,
      -0.573167, 2.003722, -2.123623
    ];
    const feats = [
      green_px / N,
      stripe_yellow / N,
      brown_rust / N,
      powdery_white / N,
      septoria_tan / N,
      dark_rot / N,
      studio_bg / N,
      non_plant_vivid / N,
      peak_ratio,
      cone_r,
      peak_ratio_g,
      cone_g,
      pinnate_ratio,
      mean_bcoh,
      high_coh_frac,
      ang_agree,
      c_green_frac,
      b_green_frac,
      c_green_frac - b_green_frac,
      Math.log1p(profile_ratio),
      (row_trans + col_trans) / N,
      Math.max(row_trans, col_trans) / (Math.min(row_trans, col_trans) + 1.0),
      gh_mean,
      gh_std,
      gs_mean,
      gv_mean,
      ge_mean
    ];
    let logit = -5.984513;
    for (let i = 0; i < weights.length; i++) logit += weights[i] * feats[i];

    if (logit < 0.0) {
      return {
        isWheat: false,
        errorType: 'NOT_WHEAT_LEAF',
        messageEn: 'The uploaded image is a normal broadleaf plant, not a wheat leaf blade (Triticum / Poaceae). Please upload or capture a clear photo of a wheat plant.',
        messageHi: 'यह फोटो सामान्य चौड़ी पत्ती वाले पौधे की है, गेहूं के पौधे (ट्रिटिकम / पोएसी) की नहीं है। कृपया केवल गेहूं की पत्ती की फोटो लें।'
      };
    }

    return {
      isWheat: true,
      errorType: 'WHEAT_LEAF',
      messageEn: 'Valid Wheat Leaf',
      messageHi: 'वैध गेहूं की पत्ती'
    };
  }

  /**
   * Dual-Stage Wheat-Only Gatekeeper used for BOTH gallery uploads and live camera frames:
   * Stage 1: 120x120 Poaceae Monocot & Parallel-Venation Structure-Tensor Validator (`validateWheatLeafImage`)
   * Stage 2: MobileNetV2 1280-D Deep Feature Wheat Recognizer (`window.WheatClassifier`)
   * Returns { isWheat, source, probability?, errorType?, messageEn?, messageHi? }.
   */
  static async verifyWheat(imageInput) {
    const imgElement = await this.loadImage(imageInput);
    return this.verifyWheatElement(imgElement);
  }

  static async verifyWheatElement(imgElement) {
    const val = this.validateWheatLeafImage(imgElement);
    // Immediately reject non-plant images (rooms, faces, cars, objects without foliage)
    if (!val.isWheat && val.errorType === 'NON_PLANT') {
      val.source = 'heuristic';
      return val;
    }

    if (window.WheatClassifier) {
      try {
        const c = await window.WheatClassifier.classify(imgElement);
        if (!c.isWheat) {
          return {
            isWheat: false,
            source: 'classifier',
            probability: c.probability,
            errorType: 'NOT_WHEAT_LEAF',
            messageEn: 'This photo is a normal plant (or non-wheat object), not a wheat plant. Wheat Doctor only analyses wheat (Triticum) leaves and plants — please upload or capture a wheat leaf.',
            messageHi: 'यह फोटो सामान्य पौधे की है, गेहूं के पौधे की नहीं। गेहूं डॉक्टर केवल गेहूं (ट्रिटिकम) की पत्ती/पौधे की जांच करता है — कृपया गेहूं की पत्ती की फोटो लें।'
          };
        }
        // High-confidence neural match OR agreement with Poaceae parallel-venation validator
        if (c.probability >= 0.72 || val.isWheat) {
          return { isWheat: true, source: 'classifier', probability: c.probability };
        }
        return {
          isWheat: false,
          source: 'dual-gate',
          probability: c.probability,
          errorType: 'NOT_WHEAT_LEAF',
          messageEn: val.messageEn,
          messageHi: val.messageHi
        };
      } catch (err) {
        console.warn('Neural wheat recogniser unavailable, using Poaceae validator:', err);
      }
    }
    val.source = 'heuristic';
    return val;
  }

  /**
   * Full On-Device Wheat Leaf Analysis & Heatmap Synthesis
   * opts.skipValidation: set when the caller already ran verifyWheat() successfully.
   */
  static async analyze(imageInput, wheatType = 'breadWheat', lang = 'hi', opts = {}) {
    const imgElement = await this.loadImage(imageInput);
    const val = opts.skipValidation ? { isWheat: true } : await this.verifyWheatElement(imgElement);
    if (!val.isWheat) {
      return {
        status: 'error',
        error_type: val.errorType,
        is_wheat_leaf: false,
        message: val.messageEn,
        message_hi: val.messageHi,
        selectedLang: lang
      };
    }

    const analysis_size = 220;
    const canvas = document.createElement('canvas');
    canvas.width = analysis_size;
    canvas.height = analysis_size;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(imgElement, 0, 0, analysis_size, analysis_size);

    const pixels = ctx.getImageData(0, 0, analysis_size, analysis_size).data;
    const edge_px = this.computeFindEdges(pixels, analysis_size, analysis_size);

    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = analysis_size;
    heatCanvas.height = analysis_size;
    const heatCtx = heatCanvas.getContext('2d');
    const heatImgData = heatCtx.createImageData(analysis_size, analysis_size);
    const hData = heatImgData.data;

    let leaf_pixels = 0;
    let green_pixels = 0;
    let stripe_yellow_rust = 0;
    let brown_leaf_rust = 0;
    let powdery_mildew = 0;
    let septoria_tan_decay = 0;

    for (let y = 0; y < analysis_size; y++) {
      for (let x = 0; x < analysis_size; x++) {
        const idx = y * analysis_size + x;
        const pIdx = idx * 4;
        const r = pixels[pIdx];
        const g = pixels[pIdx + 1];
        const b = pixels[pIdx + 2];
        const [h, s, v] = this.rgbToHsv(r, g, b);

        const is_green = (g >= r * 1.05 && g >= b * 1.05 && g > 30) || (h >= 62 && h <= 170 && s > 0.14);
        const is_pale_mildew = (s < 0.28 && v > 0.55 && Math.abs(r - g) < 28 && Math.abs(g - b) < 28 && (r > 115 || g > 115));
        const is_pycnidia_black = (r < 48 && g < 48 && b < 48 && v < 0.20);
        const is_stripe_yellow = (h >= 36 && h <= 58 && s > 0.58 && v > 0.48);
        const is_brown_rust = (h >= 12 && h < 35 && s > 0.35 && v > 0.20 && r > b * 1.25);
        const is_septoria_tan = (h >= 22 && h < 55 && s > 0.22 && v > 0.30 && edge_px[idx] > 22);

        if (is_green) {
          green_pixels++;
          leaf_pixels++;
        } else if (is_pale_mildew) {
          powdery_mildew++;
          leaf_pixels++;
          hData[pIdx] = 240; hData[pIdx + 1] = 240; hData[pIdx + 2] = 255; hData[pIdx + 3] = 220;
        } else if (is_pycnidia_black || is_septoria_tan) {
          septoria_tan_decay++;
          leaf_pixels++;
          hData[pIdx] = 220; hData[pIdx + 1] = 38; hData[pIdx + 2] = 38; hData[pIdx + 3] = 220;
        } else if (is_stripe_yellow) {
          stripe_yellow_rust++;
          leaf_pixels++;
          hData[pIdx] = 255; hData[pIdx + 1] = 215; hData[pIdx + 2] = 0; hData[pIdx + 3] = 230;
        } else if (is_brown_rust) {
          brown_leaf_rust++;
          leaf_pixels++;
          hData[pIdx] = 217; hData[pIdx + 1] = 119; hData[pIdx + 2] = 6; hData[pIdx + 3] = 230;
        }
      }
    }

    if (leaf_pixels === 0) leaf_pixels = 1;

    const total_diseased = stripe_yellow_rust + brown_leaf_rust + powdery_mildew + septoria_tan_decay;
    const disease_ratio = total_diseased / leaf_pixels;
    const affected_percentage = Math.round(disease_ratio * 1000) / 10;

    let disease_key = 'healthyWheat';
    let severity = 'healthy';
    let confidence = 96.0;

    if (disease_ratio < 0.025) {
      disease_key = 'healthyWheat';
      severity = 'healthy';
      confidence = Math.round((94.0 + (1.0 - disease_ratio * 20) * 5.2) * 10) / 10;
      confidence = Math.min(99.4, confidence);
    } else {
      if (powdery_mildew >= total_diseased * 0.35 || powdery_mildew > leaf_pixels * 0.04) {
        disease_key = 'powderyMildew';
        confidence = Math.round((94.0 + Math.min(4.8, (powdery_mildew / leaf_pixels) * 35)) * 10) / 10;
      } else if (stripe_yellow_rust >= leaf_pixels * 0.035 || (stripe_yellow_rust > brown_leaf_rust * 1.5 && stripe_yellow_rust > septoria_tan_decay * 0.7)) {
        disease_key = 'stripeRust';
        confidence = Math.round((95.0 + Math.min(4.2, (stripe_yellow_rust / leaf_pixels) * 40)) * 10) / 10;
      } else if (septoria_tan_decay >= leaf_pixels * 0.035 && powdery_mildew > leaf_pixels * 0.015) {
        disease_key = 'septoriaBlotch';
        confidence = Math.round((94.0 + Math.min(4.5, (septoria_tan_decay / leaf_pixels) * 40)) * 10) / 10;
      } else if (brown_leaf_rust > 0 || stripe_yellow_rust > 0) {
        disease_key = 'leafRust';
        confidence = Math.round((93.5 + Math.min(5.0, (brown_leaf_rust / leaf_pixels) * 38)) * 10) / 10;
      } else {
        disease_key = 'stripeRust';
        confidence = 91.0;
      }

      if (affected_percentage < 8.0) {
        severity = 'mild';
      } else if (affected_percentage < 25.0) {
        severity = 'moderate';
      } else {
        severity = 'severe';
      }
    }

    confidence = Math.min(99.1, Math.max(85.0, confidence));

    // Render blurred heatmap & composite over original resolution
    heatCtx.putImageData(heatImgData, 0, 0);
    const origW = Math.min(1024, imgElement.naturalWidth || imgElement.width || 600);
    const origH = Math.min(1024, imgElement.naturalHeight || imgElement.height || 600);

    const scaledHeatCanvas = document.createElement('canvas');
    scaledHeatCanvas.width = origW;
    scaledHeatCanvas.height = origH;
    const scaledHeatCtx = scaledHeatCanvas.getContext('2d');
    scaledHeatCtx.filter = 'blur(2px)';
    scaledHeatCtx.drawImage(heatCanvas, 0, 0, origW, origH);

    const compCanvas = document.createElement('canvas');
    compCanvas.width = origW;
    compCanvas.height = origH;
    const compCtx = compCanvas.getContext('2d');
    compCtx.drawImage(imgElement, 0, 0, origW, origH);
    compCtx.drawImage(scaledHeatCanvas, 0, 0, origW, origH);

    const heatmap_b64 = scaledHeatCanvas.toDataURL('image/png');
    const annotated_b64 = compCanvas.toDataURL('image/jpeg', 0.88);

    const disease_info = window.WHEAT_DISEASES_DATABASE[disease_key] || window.WHEAT_DISEASES_DATABASE['healthyWheat'];
    const wheat_species_info = window.WHEAT_TAXONOMY_DB.speciesTypes[wheatType] || window.WHEAT_TAXONOMY_DB.speciesTypes['breadWheat'];

    return {
      status: 'success',
      selectedLang: lang,
      crop: 'Wheat (Triticum)',
      taxonomy: {
        crop: window.WHEAT_TAXONOMY_DB.crop,
        family: window.WHEAT_TAXONOMY_DB.family,
        subfamily: window.WHEAT_TAXONOMY_DB.subfamily,
        tribe: window.WHEAT_TAXONOMY_DB.tribe,
        genus: window.WHEAT_TAXONOMY_DB.genus,
        identifiedType: wheat_species_info,
        selectedWheatTypeKey: wheatType
      },
      diseaseKey: disease_key,
      severity: severity,
      confidence: confidence,
      affectedPercentage: affected_percentage,
      leafPixelCount: leaf_pixels,
      lesionPixelCount: total_diseased,
      heatmapOverlayUrl: heatmap_b64,
      annotatedImageUrl: annotated_b64,
      diseaseData: disease_info,
      metrics: {
        healthyChlorophyllPct: Math.round((green_pixels / leaf_pixels) * 1000) / 10,
        stripeYellowRustPct: Math.round((stripe_yellow_rust / leaf_pixels) * 1000) / 10,
        brownLeafRustPct: Math.round((brown_leaf_rust / leaf_pixels) * 1000) / 10,
        powderyMildewPct: Math.round((powdery_mildew / leaf_pixels) * 1000) / 10,
        septoriaBlotchPct: Math.round((septoria_tan_decay / leaf_pixels) * 1000) / 10
      }
    };
  }
}

window.WheatVisionEngine = WheatVisionEngine;
"""


def generate_vision_engines():
    print("[2/5] Generating Client-Side Vision Engines (vision_engine.js)...")
    # Normalize sample paths to relative `static/samples/...` so they work in Flask, GitHub Pages, and Android APK
    samples_rel = []
    for s in WHEAT_SAMPLES_METADATA:
        item = dict(s)
        item['path'] = 'static/samples/' + item['filename']
        samples_rel.append(item)

    root_js = (
        VISION_ENGINE_JS_TEMPLATE
        .replace("__TAXONOMY_JSON__", json.dumps(WHEAT_TAXONOMY, ensure_ascii=False, indent=2))
        .replace("__DISEASES_JSON__", json.dumps(WHEAT_DISEASES_DB, ensure_ascii=False, indent=2))
        .replace("__SAMPLES_JSON__", json.dumps(samples_rel, ensure_ascii=False, indent=2))
    )
    with open(os.path.join(BASE_DIR, "static", "vision_engine.js"), "w", encoding="utf-8") as f:
        f.write(root_js)

    proto_js = (
        VISION_ENGINE_JS_TEMPLATE
        .replace("__TAXONOMY_JSON__", json.dumps(PROTO_TAXONOMY, ensure_ascii=False, indent=2))
        .replace("__DISEASES_JSON__", json.dumps(PROTO_DISEASES_DB, ensure_ascii=False, indent=2))
        .replace("__SAMPLES_JSON__", json.dumps(samples_rel, ensure_ascii=False, indent=2))
    )
    with open(os.path.join(BASE_DIR, "prototype", "static", "vision_engine.js"), "w", encoding="utf-8") as f:
        f.write(proto_js)

    # Sync wheat_classifier.js, lib/tf.min.js, and models/ into prototype/static as well
    proto_static = os.path.join(BASE_DIR, "prototype", "static")
    wc_src = os.path.join(BASE_DIR, "static", "wheat_classifier.js")
    if os.path.exists(wc_src):
        shutil.copy2(wc_src, os.path.join(proto_static, "wheat_classifier.js"))
    for subdir in ("lib", "models"):
        s_dir = os.path.join(BASE_DIR, "static", subdir)
        d_dir = os.path.join(proto_static, subdir)
        if os.path.exists(s_dir):
            if os.path.exists(d_dir):
                shutil.rmtree(d_dir)
            shutil.copytree(s_dir, d_dir)


def generate_pwa_files():
    print("[3/5] Generating PWA Manifest & Service Worker (manifest.json, sw.js)...")
    manifest = {
        "name": "Wheat Doctor AI — गेहूं डॉक्टर",
        "short_name": "Wheat Doctor",
        "description": "AI-Powered Wheat Crop Pathology, Cultivar & Botanical Taxonomy Diagnostic System in 12 Indian Languages.",
        "start_url": "./index.html",
        "scope": "./",
        "display": "standalone",
        "orientation": "portrait",
        "background_color": "#07140E",
        "theme_color": "#07140E",
        "categories": ["agriculture", "education", "medical", "utilities"],
        "icons": [
            {
                "src": "static/icons/icon-192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any maskable"
            },
            {
                "src": "static/icons/icon-512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any maskable"
            }
        ]
    }

    sw_code = """/**
 * Wheat Doctor AI — Offline Service Worker (sw.js)
 * Caches core application shell, styles, vision engine, and calibrated wheat samples
 * for 100% offline field operation on Android phones.
 */
const CACHE_NAME = 'wheat-doctor-v2.1.0';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './static/style.css',
  './static/vision_engine.js',
  './static/wheat_classifier.js',
  './static/lib/tf.min.js',
  './static/models/wheat_head.json',
  './static/models/mobilenet_v2_fv/model.json',
  './static/models/mobilenet_v2_fv/group1-shard1of3.bin',
  './static/models/mobilenet_v2_fv/group1-shard2of3.bin',
  './static/models/mobilenet_v2_fv/group1-shard3of3.bin',
  './static/app.js',
  './static/icons/icon-192.png',
  './static/icons/icon-512.png',
  './static/samples/wheat_healthy.jpg',
  './static/samples/wheat_stripe_rust.jpg',
  './static/samples/wheat_leaf_rust.jpg',
  './static/samples/wheat_powdery_mildew.jpg',
  './static/samples/wheat_septoria_blotch.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
"""

    for folder in [os.path.join(BASE_DIR, "static"), os.path.join(BASE_DIR, "prototype", "static")]:
        with open(os.path.join(folder, "manifest.json"), "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        with open(os.path.join(folder, "sw.js"), "w", encoding="utf-8") as f:
            f.write(sw_code)

    # Also write root manifest.json and sw.js for GitHub Pages root hosting
    with open(os.path.join(BASE_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    with open(os.path.join(BASE_DIR, "sw.js"), "w", encoding="utf-8") as f:
        f.write(sw_code)


def build_static_and_android_bundles():
    print("[4/5] Building Standalone Web Bundle (dist/) & Android WebView Assets (android/app/src/main/assets/www/)...")
    template_path = os.path.join(BASE_DIR, "templates", "index.html")
    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Convert root-absolute `/static/` and `/manifest.json` references to relative `static/` and `manifest.json`
    # so the HTML works seamlessly on Flask (/), GitHub Pages (/Wheat-Doctor/), and Android WebView (file:///android_asset/www/)
    standalone_html = (
        html
        .replace('href="/static/', 'href="static/')
        .replace('src="/static/', 'src="static/')
        .replace('href="/manifest.json"', 'href="manifest.json"')
    )

    # Also write root index.html so GitHub Pages can serve directly from repo root or dist/
    with open(os.path.join(BASE_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(standalone_html)

    for target_root in [
        os.path.join(BASE_DIR, "dist"),
        os.path.join(BASE_DIR, "android", "app", "src", "main", "assets", "www")
    ]:
        if os.path.exists(target_root):
            shutil.rmtree(target_root)
        os.makedirs(target_root, exist_ok=True)

        with open(os.path.join(target_root, "index.html"), "w", encoding="utf-8") as f:
            f.write(standalone_html)
        shutil.copy2(os.path.join(BASE_DIR, "manifest.json"), os.path.join(target_root, "manifest.json"))
        shutil.copy2(os.path.join(BASE_DIR, "sw.js"), os.path.join(target_root, "sw.js"))
        shutil.copytree(os.path.join(BASE_DIR, "static"), os.path.join(target_root, "static"))

        # Create .nojekyll for GitHub Pages
        with open(os.path.join(target_root, ".nojekyll"), "w", encoding="utf-8") as f:
            f.write("")

    with open(os.path.join(BASE_DIR, ".nojekyll"), "w", encoding="utf-8") as f:
        f.write("")


def generate_windows_batch_files():
    """Ensure all Windows .bat files use pure 7-bit ASCII and strict CRLF (\\r\\n) line endings."""
    gitattributes = "* text=auto\n*.bat text eol=crlf\n*.cmd text eol=crlf\n"
    with open(os.path.join(BASE_DIR, ".gitattributes"), "w", encoding="ascii", newline="\n") as f:
        f.write(gitattributes)

    bat_files = {
        os.path.join(BASE_DIR, "push_to_github.bat"): (
            "@echo off\n"
            "title Wheat Doctor - GitHub Push and Android APK Builder\n"
            "cd /d \"%~dp0\"\n"
            "python deploy_github.py %*\n"
            "echo.\n"
            "pause\n"
        ),
        os.path.join(BASE_DIR, "start.bat"): (
            "@echo off\n"
            "title Wheat Doctor AI Server Launcher\n"
            "echo ========================================================\n"
            "echo               WHEAT DOCTOR AI (12 Languages)\n"
            "echo       Wheat Crop, Cultivar and Pathology Diagnostic AI\n"
            "echo ========================================================\n"
            "echo.\n"
            "cd /d \"%~dp0\"\n"
            "echo Choose launch mode:\n"
            "echo   [1] Worldwide Public Access (ANY phone/network, 4G, 5G, Remote)\n"
            "echo   [2] Local Mode (This PC + Local Wi-Fi only)\n"
            "echo.\n"
            "set /p mode=\"Enter choice [1 or 2] (Default is 1): \"\n"
            "\n"
            "if \"%mode%\"==\"2\" (\n"
            "    echo.\n"
            "    echo Launching Local Mode...\n"
            "    start \"\" http://127.0.0.1:5000\n"
            "    python app.py\n"
            ") else (\n"
            "    echo.\n"
            "    echo Launching Worldwide Online Mode with Global Tunnel...\n"
            "    start \"\" http://127.0.0.1:5000\n"
            "    python app.py --online\n"
            ")\n"
            "\n"
            "pause\n"
        ),
        os.path.join(BASE_DIR, "start_online.bat"): (
            "@echo off\n"
            "title Wheat Doctor AI - Worldwide Public Access\n"
            "echo ========================================================\n"
            "echo          WHEAT DOCTOR AI - WORLDWIDE ONLINE MODE\n"
            "echo     Foliar Pathology, Rust Diagnostic and Cultivar AI\n"
            "echo ========================================================\n"
            "echo.\n"
            "echo [1/2] Navigating to Wheat Doctor directory...\n"
            "cd /d \"%~dp0\"\n"
            "\n"
            "echo [2/2] Starting Wheat Doctor AI with Global HTTPS Tunnel...\n"
            "echo.\n"
            "echo * Note: A secure HTTPS link will be generated below.\n"
            "echo * Anyone on 4G, 5G, or any Wi-Fi worldwide can open it!\n"
            "echo.\n"
            "\n"
            "python app.py --online\n"
            "\n"
            "pause\n"
        ),
        os.path.join(BASE_DIR, "prototype", "start.bat"): (
            "@echo off\n"
            "title Wheat Doctor Prototype (English and Hindi) Launcher\n"
            "echo ========================================================\n"
            "echo        WHEAT DOCTOR PROTOTYPE (English and Hindi)\n"
            "echo     Wheat Crop, Cultivar and Rust Pathology Diagnostic AI\n"
            "echo ========================================================\n"
            "echo.\n"
            "cd /d \"%~dp0\"\n"
            "echo Choose launch mode:\n"
            "echo   [1] Local Mode (This PC + Local Wi-Fi)\n"
            "echo   [2] Worldwide Public Access (ANY phone/network, 4G, 5G, Remote)\n"
            "echo.\n"
            "set /p mode=\"Enter choice [1 or 2] (Default is 1): \"\n"
            "\n"
            "if \"%mode%\"==\"2\" (\n"
            "    echo.\n"
            "    echo Launching Worldwide Online Mode with Global Tunnel...\n"
            "    start \"\" http://127.0.0.1:5000\n"
            "    python app.py --online\n"
            ") else (\n"
            "    echo.\n"
            "    echo Launching Local Mode...\n"
            "    start \"\" http://127.0.0.1:5000\n"
            "    python app.py\n"
            ")\n"
            "\n"
            "pause\n"
        ),
    }

    for path, content in bat_files.items():
        with open(path, "w", encoding="ascii", newline="\r\n") as f:
            f.write(content)


if __name__ == "__main__":
    generate_all_icons()
    generate_vision_engines()
    generate_pwa_files()
    build_static_and_android_bundles()
    generate_windows_batch_files()
    print("[5/5] Bundle generation complete! Ready for Android APK & GitHub deployment.")

