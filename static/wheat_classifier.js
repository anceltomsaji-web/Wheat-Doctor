/**
 * Wheat Doctor AI - On-Device Wheat Plant Recognizer (wheat_classifier.js)
 * ======================================================================
 * Gatekeeper that decides "is this photo a WHEAT plant at all?" BEFORE any
 * disease analysis runs. Works identically for gallery uploads and live
 * camera frames, 100% offline.
 *
 *   image -> 224x224 -> MobileNetV2 (ImageNet, TF-Hub feature vector, 1280-d)
 *         -> L2-normalise -> logistic-regression head trained on wheat vs
 *            non-wheat photos -> probability that the photo is wheat.
 *
 * Head weights live in static/models/wheat_head.json (trained by
 * train_wheat_classifier.py). The backbone lives in static/models/mobilenet_v2_fv/.
 */
(function (global) {
  'use strict';

  const BACKBONE_URL = 'static/models/mobilenet_v2_fv/model.json';
  const HEAD_URL = 'static/models/wheat_head.json';
  const INPUT = 224;

  let backbone = null;
  let head = null;
  let loadPromise = null;

  function xhr(url, type) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = type;
      req.onload = () => {
        // file:// (Android assets) reports status 0 on success
        if ((req.status >= 200 && req.status < 300) || (req.status === 0 && req.response)) {
          resolve(req.response);
        } else {
          reject(new Error('HTTP ' + req.status + ' for ' + url));
        }
      };
      req.onerror = () => reject(new Error('Network error loading ' + url));
      req.send();
    });
  }

  async function loadBackbone(baseUrl) {
    const modelJson = await xhr(baseUrl, 'json');
    const dir = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
    const weightSpecs = [];
    const paths = [];
    for (const group of modelJson.weightsManifest) {
      for (const w of group.weights) weightSpecs.push(w);
      for (const p of group.paths) paths.push(p);
    }
    const shards = await Promise.all(paths.map((p) => xhr(dir + p, 'arraybuffer')));
    let total = 0;
    shards.forEach((s) => { total += s.byteLength; });
    const weightData = new Uint8Array(total);
    let off = 0;
    shards.forEach((s) => { weightData.set(new Uint8Array(s), off); off += s.byteLength; });
    const artifacts = {
      modelTopology: modelJson.modelTopology,
      format: modelJson.format,
      generatedBy: modelJson.generatedBy,
      convertedBy: modelJson.convertedBy,
      weightSpecs: weightSpecs,
      weightData: weightData.buffer
    };
    return tf.loadGraphModel(tf.io.fromMemory(artifacts));
  }

  async function ensureLoaded(opts) {
    if (backbone && head) return true;
    if (loadPromise) return loadPromise;
    opts = opts || {};
    loadPromise = (async () => {
      if (typeof tf === 'undefined') throw new Error('TensorFlow.js is not available');
      try {
        await tf.setBackend('webgl');
      } catch (e) {
        await tf.setBackend('cpu');
      }
      await tf.ready();
      backbone = await loadBackbone(opts.backboneUrl || BACKBONE_URL);
      if (!opts.skipHead) head = await xhr(opts.headUrl || HEAD_URL, 'json');
      return true;
    })().catch((err) => {
      loadPromise = null;
      backbone = null;
      head = null;
      throw err;
    });
    return loadPromise;
  }

  function drawToCanvas(source, crop, flip) {
    const c = document.createElement('canvas');
    c.width = INPUT;
    c.height = INPUT;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const sw = source.naturalWidth || source.videoWidth || source.width;
    const sh = source.naturalHeight || source.videoHeight || source.height;
    let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
    if (crop && crop.w) {
      sx = Math.round(crop.x * sw);
      sy = Math.round(crop.y * sh);
      sWidth = Math.max(8, Math.round(crop.w * sw));
      sHeight = Math.max(8, Math.round(crop.h * sh));
    }
    if (flip) {
      ctx.translate(INPUT, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(source, sx, sy, sWidth, sHeight, 0, 0, INPUT, INPUT);
    return c;
  }

  /** 1280-d L2-normalised embedding for one image / crop. */
  function embed(source, crop, flip) {
    const canvas = drawToCanvas(source, crop, flip);
    return tf.tidy(() => {
      const x = tf.browser.fromPixels(canvas).toFloat().div(255).expandDims(0); // TF-Hub expects [0,1]
      let f = backbone.predict(x);
      if (Array.isArray(f)) f = f[0];
      f = f.reshape([-1]);
      const n = f.norm();
      return f.div(n.add(1e-8));
    });
  }

  function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

  /**
   * Returns { loaded, isWheat, probability, threshold }.
   * Uses full frame + a centre crop and takes the MORE CONFIDENT NON-WHEAT view
   * (min probability), so a stray green background can't sneak a foreign plant through.
   */
  async function classify(source) {
    await ensureLoaded();
    const views = [
      { crop: null, flip: false },
      { crop: { x: 0.15, y: 0.15, w: 0.7, h: 0.7 }, flip: false }
    ];
    const probs = [];
    for (const v of views) {
      const e = embed(source, v.crop, v.flip);
      const data = await e.data();
      e.dispose();
      let z = head.bias;
      for (let i = 0; i < data.length; i++) {
        z += ((data[i] - head.mean[i]) / head.scale[i]) * head.weights[i];
      }
      probs.push(sigmoid(z));
    }
    const probability = Math.min.apply(null, probs);
    return {
      loaded: true,
      isWheat: probability >= head.threshold,
      probability: probability,
      probabilities: probs,
      threshold: head.threshold
    };
  }

  global.WheatClassifier = {
    ensureLoaded: ensureLoaded,
    embed: embed,
    classify: classify,
    INPUT: INPUT
  };
})(typeof window !== 'undefined' ? window : this);
