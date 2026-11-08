/**
 * Wheat Doctor Prototype — English & Hindi AI Diagnostic System
 * Botanical Taxonomy, Rust Pathology, Heatmaps & Voice Assistant
 */

const BILINGUAL_LANGUAGES = [
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳', speechCode: 'hi-IN', tag: 'अनुशंसित (Recommended)' },
  { code: 'en', native: 'English', english: 'English', flag: '🇬🇧', speechCode: 'en-IN', tag: 'International' }
];

const i18n = {
  en: {
    appTitle: "Wheat Doctor",
    appSubtitle: "Wheat Crop AI Prototype",
    welcome: "Wheat Doctor (गेहूं डॉक्टर)",
    welcomeSub: "Specialized AI for Wheat Crops, Botanical Taxonomy & Rust Diagnostics",
    captureTitle: "Analyze Wheat Leaf Blade",
    captureSub: "Take a photo of the wheat leaf or test with calibrated wheat samples",
    varTitle: "🌾 Wheat Species & Cultivar Type",
    breadTitle: "Bread Wheat",
    breadTag: "Roti / Chapati",
    durumTitle: "Durum / Pasta",
    durumTag: "Suji / Semolina",
    emmerTitle: "Khapli / Emmer",
    emmerTag: "Ancient Grain",
    dropHeading: "Capture or Upload Wheat Leaf",
    dropSub: "JPG, PNG, WebP • Drag & drop supported",
    btnCamera: "Open Camera",
    btnGallery: "Upload from Gallery",
    samplesTitle: "🧪 1-Click Wheat Test Samples",
    samplesHint: "Tap any sample to test diagnosis",
    scanTitle: "Scanning Wheat Blade Morphology...",
    scanSub: "Classifying botanical family, cultivar & fungal rust spores",
    sevHeading: "Infection Severity",
    affectedArea: "Affected Surface Area:",
    voiceTitle: "Audio Diagnosis (Voice Assistant)",
    voiceIdle: "Tap play to listen to treatment in English",
    voicePlaying: "Reading diagnosis aloud in English...",
    tabSummary: "📋 Summary",
    tabChemical: "🧪 Chemical Spray",
    tabOrganic: "🍃 Organic",
    tabVarieties: "🌾 Resistant Varieties",
    tabPrevention: "🛡️ Prevention",
    btnScanAgain: "Scan Another Wheat Leaf",
    btnSaveReport: "Save / Print Diagnostic Report",
    lblTaxoGenus: "Genus & Tribe:",
    lblTaxoType: "Wheat Cultivar Type:",
    lblDosageTitle: "📏 Recommended Dosage per Acre:",
    severityWords: {
      healthy: "Optimal Health",
      mild: "Mild (Early Stage)",
      moderate: "Moderate (Active Rust)",
      severe: "Severe (Critical Epidemic)"
    }
  },
  hi: {
    appTitle: "गेहूं डॉक्टर (Wheat Doctor)",
    appSubtitle: "गेहूं रोग व कुल निदान",
    welcome: "गेहूं डॉक्टर (Wheat Doctor AI)",
    welcomeSub: "गेहूं की फसल, वनस्पति कुल (पोएसी) और रतुआ रोग निदान प्रणाली",
    captureTitle: "गेहूं की पत्ती की जांच करें",
    captureSub: "पत्ती की फोटो खींचें या नीचे दिए गए गेहूं सैंपल से जांचें",
    varTitle: "🌾 गेहूं की प्रजाति व किस्म का चयन",
    breadTitle: "रोटी गेहूं (Bread)",
    breadTag: "रोटी / चपाती",
    durumTitle: "कठिया (Durum)",
    durumTag: "सूजी / पास्ता",
    emmerTitle: "खापली (Emmer)",
    emmerTag: "प्राचीन गेहूं",
    dropHeading: "गेहूं की पत्ती की फोटो लें या अपलोड करें",
    dropSub: "JPG, PNG, WebP • ड्रैग और ड्रॉप समर्थित",
    btnCamera: "कैमरा खोलें",
    btnGallery: "गैलरी से फोटो चुनें",
    samplesTitle: "🧪 1-क्लिक गेहूं टेस्ट सैंपल",
    samplesHint: "जांच देखने के लिए किसी भी पत्ती पर टैप करें",
    scanTitle: "गेहूं की पत्ती की एआई जांच जारी है...",
    scanSub: "वनस्पति कुल (ग्रेमिनी), किस्म और रतुआ फफूंद का विश्लेषण",
    sevHeading: "संक्रमण की गंभीरता",
    affectedArea: "प्रभावित पत्ती का क्षेत्रफल:",
    voiceTitle: "आवाज में रोग निदान",
    voiceIdle: "उपचार सुनने के लिए प्ले बटन दबाएं",
    voicePlaying: "उपचार पढ़कर सुनाया जा रहा है...",
    tabSummary: "📋 सारांश",
    tabChemical: "🧪 रासायनिक दवा",
    tabOrganic: "🍃 जैविक उपचार",
    tabVarieties: "🌾 रोगरोधी किस्में",
    tabPrevention: "🛡️ रोकथाम व सावधानी",
    btnScanAgain: "दूसरी गेहूं की पत्ती जांचें",
    btnSaveReport: "रिपोर्ट सेव / प्रिंट करें",
    lblTaxoGenus: "वंश व जनजाति (Genus):",
    lblTaxoType: "गेहूं का प्रकार व प्लॉइडी:",
    lblDosageTitle: "📏 दवा की मात्रा प्रति एकड़:",
    severityWords: {
      healthy: "उत्तम स्वास्थ्य",
      mild: "हल्का (शुरुआती अवस्था)",
      moderate: "मध्यम (सक्रिय रतुआ)",
      severe: "गंभीर (खतरनाक रतुआ)"
    }
  }
};

const appState = {
  lang: 'hi', // default to Hindi, easily toggled to English
  selectedWheatType: 'breadWheat',
  currentScreen: 'lang',
  currentImageBase64: null,
  currentResult: null,
  viewMode: 'raw',
  isSpeaking: false,
  webcamStream: null,
  cameraFacing: 'environment',
  scanHistory: []
};
window.appState = appState;

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  renderBilingualGrid();
  applyTranslations(appState.lang);
  loadScanHistory();
  loadWheatSamples();
  setupDropzone();
  initSpeechSynthesis();
  initNetworkInfo();
});

// ================= RENDER BILINGUAL LANGUAGE CARDS =================
function renderBilingualGrid() {
  const container = document.getElementById('lang-grid-container');
  if (!container) return;
  container.innerHTML = '';

  BILINGUAL_LANGUAGES.forEach(lang => {
    const card = document.createElement('button');
    card.className = 'bilingual-lang-card' + (appState.lang === lang.code ? ' active' : '');
    card.onclick = () => selectLanguage(lang.code);
    card.innerHTML = `
      <span class="bilingual-flag">${lang.flag}</span>
      <div class="bilingual-info">
        <span class="bilingual-native">${lang.native}</span>
        <span class="bilingual-english">${lang.english}</span>
        <span class="bilingual-tag">${lang.tag}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// Fast Switcher in Top Navigation
function toggleBilingualLang() {
  const nextLang = appState.lang === 'hi' ? 'en' : 'hi';
  selectLanguage(nextLang, false);
}

// Select Language
function selectLanguage(langCode, advanceScreen = true) {
  appState.lang = langCode;
  applyTranslations(langCode);
  renderBilingualGrid();
  updateTopNavLangPill();

  // If on result screen, refresh displayed texts in new language
  if (appState.currentScreen === 'result' && appState.currentResult) {
    renderAnalysisResults(appState.currentResult);
  }

  if (advanceScreen && appState.currentScreen === 'lang') {
    goToScreen('capture');
  }
}

function updateTopNavLangPill() {
  const flagEl = document.getElementById('current-lang-flag');
  const pillEl = document.getElementById('current-lang-pill');
  if (flagEl && pillEl) {
    if (appState.lang === 'hi') {
      flagEl.textContent = '🇮🇳';
      pillEl.textContent = 'हिन्दी';
    } else {
      flagEl.textContent = '🇬🇧';
      pillEl.textContent = 'English';
    }
  }
}

// ================= APPLY I18N TRANSLATIONS =================
function applyTranslations(lang) {
  const t = i18n[lang] || i18n['hi'];

  const map = {
    'nav-brand-title': t.appTitle,
    'nav-brand-sub': t.appSubtitle,
    'txt-lang-welcome': t.welcome,
    'txt-lang-sub': t.welcomeSub,
    'txt-capture-title': t.captureTitle,
    'txt-capture-sub': t.captureSub,
    'txt-var-title': t.varTitle,
    'chip-main-bread': t.breadTitle,
    'chip-tag-bread': t.breadTag,
    'chip-main-durum': t.durumTitle,
    'chip-tag-durum': t.durumTag,
    'chip-main-emmer': t.emmerTitle,
    'chip-tag-emmer': t.emmerTag,
    'txt-drop-heading': t.dropHeading,
    'txt-drop-sub': t.dropSub,
    'txt-btn-camera': t.btnCamera,
    'txt-btn-gallery': t.btnGallery,
    'txt-samples-title': t.samplesTitle,
    'txt-samples-hint': t.samplesHint,
    'scan-progress-text': t.scanTitle,
    'scan-step-detail': t.scanSub,
    'txt-sev-heading': t.sevHeading,
    'txt-affected-area': t.affectedArea,
    'txt-voice-title': t.voiceTitle,
    'txt-voice-status': appState.isSpeaking ? t.voicePlaying : t.voiceIdle,
    'tab-lbl-summary': t.tabSummary,
    'tab-lbl-chemical': t.tabChemical,
    'tab-lbl-organic': t.tabOrganic,
    'tab-lbl-varieties': t.tabVarieties,
    'tab-lbl-prevention': t.tabPrevention,
    'txt-btn-scan-again': t.btnScanAgain,
    'txt-btn-save-report': t.btnSaveReport,
    'lbl-taxo-genus': t.lblTaxoGenus,
    'lbl-taxo-type': t.lblTaxoType,
    'txt-dosage-title': t.lblDosageTitle
  };

  Object.entries(map).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}

// ================= SCREEN NAVIGATION =================
function goToScreen(screenName) {
  appState.currentScreen = screenName;
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('screen-' + screenName);
  if (target) target.classList.add('active');

  const stepMap = { 'lang': 0, 'capture': 1, 'scan': 2, 'result': 3 };
  const stepIdx = stepMap[screenName] || 0;
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i <= stepIdx) {
        dot.className = 'step-dot active';
      } else {
        dot.className = 'step-dot';
      }
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetToCapture() {
  stopAudio();
  goToScreen('capture');
}

// ================= CULTIVAR TYPE SELECTOR =================
function selectWheatType(type, btn) {
  appState.selectedWheatType = type;
  document.querySelectorAll('.var-chip').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// ================= LOAD CALIBRATED WHEAT SAMPLES =================
function renderProtoSamples(samples) {
  const container = document.getElementById('samples-container');
  if (!container || !samples) return;
  container.innerHTML = '';
  samples.forEach(s => {
    const title = appState.lang === 'hi' ? (s.title_hi || s.title) : s.title;
    const badge = appState.lang === 'hi' ? (s.badge_hi || s.badge) : s.badge;
    const relPath = s.path && s.path.startsWith('/') ? s.path.slice(1) : (s.path || ('static/samples/' + s.filename));
    const card = document.createElement('div');
    card.className = 'sample-leaf-card';
    card.onclick = () => testWheatSample({ ...s, path: relPath });
    card.innerHTML = `
      <img class="sample-leaf-thumb" src="${relPath}" alt="${title}" loading="lazy" crossorigin="anonymous">
      <div class="sample-leaf-info">
        <span class="sample-leaf-title">${title}</span>
        <span class="sample-leaf-badge">${badge}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

async function loadWheatSamples() {
  if (window.location.protocol === 'file:' || window.location.hostname.endsWith('github.io')) {
    if (window.WHEAT_SAMPLES_LIST) {
      renderProtoSamples(window.WHEAT_SAMPLES_LIST);
      return;
    }
  }
  try {
    const res = await fetch('/api/samples');
    const data = await res.json();
    if (data.status === 'success' && data.samples) {
      renderProtoSamples(data.samples);
      return;
    }
  } catch (err) {
    console.warn('Using built-in offline samples:', err);
  }
  if (window.WHEAT_SAMPLES_LIST) {
    renderProtoSamples(window.WHEAT_SAMPLES_LIST);
  }
}

async function testWheatSample(sample) {
  stopCamera();
  showScanScreen(sample.path);

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      runWheatAnalysis(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = async () => {
      const res = await fetch(sample.path);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => runWheatAnalysis(reader.result);
      reader.readAsDataURL(blob);
    };
    img.src = sample.path;
  } catch (err) {
    alert('Error testing sample: ' + err.message);
    goToScreen('capture');
  }
}

// ================= DROPZONE & UPLOAD =================
function setupDropzone() {
  const dropzone = document.getElementById('drop-zone');
  if (!dropzone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, () => dropzone.classList.add('dragover'));
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, () => dropzone.classList.remove('dragover'));
  });

  dropzone.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    if (files.length > 0) processSelectedFile(files[0]);
  });
}

function triggerFileInput() {
  document.getElementById('galleryFileInput').click();
}

function handleFileSelected(event) {
  const file = event.target.files[0];
  if (file) processSelectedFile(file);
}

function processSelectedFile(file) {
  stopCamera();
  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result;
    showScanScreen(base64);
    runWheatAnalysis(base64);
  };
  reader.readAsDataURL(file);
}

// ================= LIVE WEBCAM =================
async function startLiveCamera() {
  const container = document.getElementById('camera-container');
  const video = document.getElementById('webcam-video');
  const dropzone = document.getElementById('drop-zone');

  try {
    if (appState.webcamStream) {
      stopCamera();
    }
    const constraints = {
      video: {
        facingMode: appState.cameraFacing,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    appState.webcamStream = stream;
    video.srcObject = stream;
    container.style.display = 'block';
    if (dropzone) dropzone.style.display = 'none';
  } catch (err) {
    console.warn('Live camera error, falling back to file capture:', err);
    document.getElementById('cameraFileInput').click();
  }
}

function stopCamera() {
  if (appState.webcamStream) {
    appState.webcamStream.getTracks().forEach(track => track.stop());
    appState.webcamStream = null;
  }
  const container = document.getElementById('camera-container');
  const dropzone = document.getElementById('drop-zone');
  if (container) container.style.display = 'none';
  if (dropzone) dropzone.style.display = 'block';
}

function switchCameraFacing() {
  appState.cameraFacing = appState.cameraFacing === 'environment' ? 'user' : 'environment';
  startLiveCamera();
}

function captureLiveSnapshot() {
  const video = document.getElementById('webcam-video');
  if (!video) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base64 = canvas.toDataURL('image/jpeg', 0.9);

  stopCamera();
  showScanScreen(base64);
  runWheatAnalysis(base64);
}

// ================= SCANNING ANIMATION =================
function showScanScreen(imgSrc) {
  const preview = document.getElementById('scan-preview-img');
  if (preview) preview.src = imgSrc;
  appState.currentImageBase64 = imgSrc;
  goToScreen('scan');

  const fill = document.getElementById('scan-progress-fill');
  if (fill) {
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = '35%'; }, 200);
    setTimeout(() => { fill.style.width = '75%'; }, 600);
    setTimeout(() => { fill.style.width = '100%'; }, 1000);
  }
}

// ================= RUN AI ANALYSIS =================
async function runWheatAnalysis(imagePayload) {
  const isStandaloneApp = window.location.protocol === 'file:' || window.location.hostname.endsWith('github.io');
  try {
    let result = null;
    if (isStandaloneApp && window.WheatVisionEngine) {
      result = await window.WheatVisionEngine.analyze(imagePayload, appState.selectedWheatType, appState.lang);
    } else {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imagePayload,
          wheat_type: appState.selectedWheatType,
          lang: appState.lang
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      result = await res.json();
    }

    if (result.status === 'error' || result.error_type === 'NOT_WHEAT_LEAF' || result.error_type === 'NON_PLANT' || result.is_wheat_leaf === false) {
      goToScreen('capture');
      showNotWheatModal(result);
      return;
    }

    if (result.status === 'success') {
      setTimeout(() => {
        appState.currentResult = result;
        renderAnalysisResults(result);
        saveScanToHistory(result);
        goToScreen('result');
      }, 600);
    } else {
      goToScreen('capture');
      showNotWheatModal(result);
    }
  } catch (err) {
    if (window.WheatVisionEngine) {
      try {
        const localRes = await window.WheatVisionEngine.analyze(imagePayload, appState.selectedWheatType, appState.lang);
        if (localRes.status === 'error' || localRes.is_wheat_leaf === false) {
          goToScreen('capture');
          showNotWheatModal(localRes);
          return;
        }
        appState.currentResult = localRes;
        renderAnalysisResults(localRes);
        saveScanToHistory(localRes);
        goToScreen('result');
        return;
      } catch (e2) {}
    }
    goToScreen('capture');
    alert('Analysis Error: ' + err.message);
  }
}

// ================= NON-WHEAT LEAF REJECTION MODAL =================
function showNotWheatModal(result) {
  const modal = document.getElementById('modal-not-wheat');
  if (!modal) return;

  const lang = appState.lang || 'hi';
  const titleEl = document.getElementById('not-wheat-modal-title');
  const subEl = document.getElementById('not-wheat-modal-sub');
  const msgEl = document.getElementById('not-wheat-modal-msg');
  const btnTextEl = document.getElementById('not-wheat-btn-text');

  if (lang === 'hi') {
    if (titleEl) titleEl.textContent = "गेहूं की पत्ती नहीं है!";
    if (subEl) subEl.textContent = "अपलोड की गई फोटो गेहूं के पौधे की पत्ती नहीं है।";
    if (msgEl) msgEl.textContent = result?.message_hi || "गेहूं डॉक्टर विशेष रूप से गेहूं की फसल (रोटी, कठिया व खापली गेहूं) और रतुआ रोगों (पीला/भूरा रतुआ, चूर्णिल फफूंद, सेप्टोरिया) के सटीक निदान के लिए बनाया गया है। कृपया गेहूं की पत्ती की साफ फोटो अपलोड करें।";
    if (btnTextEl) btnTextEl.textContent = "गेहूं की पत्ती अपलोड करें";
  } else {
    if (titleEl) titleEl.textContent = "Not a Wheat Leaf!";
    if (subEl) subEl.textContent = "The uploaded image is not of a wheat plant (Poaceae family).";
    if (msgEl) msgEl.textContent = result?.message || "Wheat Doctor is specialized exclusively for Wheat crops (Triticum aestivum, T. durum, T. dicoccum) and foliar rust diagnostics. Please upload a clear photo of a wheat leaf blade.";
    if (btnTextEl) btnTextEl.textContent = "Upload Wheat Leaf Blade";
  }

  modal.style.display = 'flex';
}

function closeNotWheatModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('.modal-close-btn') && !e.target.closest('.btn-try-wheat')) return;
  const modal = document.getElementById('modal-not-wheat');
  if (modal) modal.style.display = 'none';
  goToScreen('capture');
}

// ================= RENDER DIAGNOSTIC RESULTS =================
function renderAnalysisResults(result) {
  const lang = appState.lang;
  const t = i18n[lang] || i18n['hi'];
  const diseaseData = result.diseaseData || {};
  const langData = diseaseData[lang] || diseaseData['en'] || {};
  const identifiedType = result.taxonomy?.identifiedType || {};

  // Botanical Taxonomy Header
  const cropName = result.taxonomy?.crop ? (result.taxonomy.crop[lang] || result.taxonomy.crop['en']) : 'Wheat (गेहूं)';
  const familyName = result.taxonomy?.family ? (result.taxonomy.family[lang] || result.taxonomy.family['en']) : 'Poaceae (ग्रेमिनी)';
  const speciesTypeName = identifiedType.name ? (identifiedType.name[lang] || identifiedType.name['en']) : identifiedType.scientific;

  const cropEl = document.getElementById('res-crop-name');
  if (cropEl) cropEl.textContent = cropName;
  const familyEl = document.getElementById('res-family-name');
  if (familyEl) familyEl.textContent = familyName;
  const typeEl = document.getElementById('res-wheat-type-name');
  if (typeEl) typeEl.textContent = speciesTypeName;

  // Disease Title & Scientific Name
  const diseaseTitle = langData.name || 'Wheat Condition';
  const scientificName = langData.scientific || diseaseData.en?.scientific || 'Triticum aestivum';
  document.getElementById('res-disease-title').textContent = diseaseTitle;
  document.getElementById('res-scientific-name').textContent = scientificName;

  // Health Pill & Confidence
  const healthPill = document.getElementById('res-health-pill');
  const confPill = document.getElementById('res-conf-pill');
  if (healthPill) {
    healthPill.textContent = langData.status || (result.diseaseKey === 'healthyWheat' ? 'Healthy Leaf' : 'Pathogen Detected');
    healthPill.className = 'health-pill ' + (result.diseaseKey === 'healthyWheat' ? 'status-healthy' : 'status-diseased');
  }
  if (confPill) {
    confPill.textContent = `${result.confidence || 96}% AI Confidence`;
  }

  // Leaf Images (Raw vs Heatmap)
  const leafImg = document.getElementById('res-leaf-image');
  const heatImg = document.getElementById('res-heatmap-overlay');
  if (leafImg) leafImg.src = appState.currentImageBase64 || result.annotatedImageUrl;
  if (heatImg) heatImg.src = result.annotatedImageUrl || result.heatmapOverlayUrl;
  setImageViewMode('raw');

  // Severity Meter
  const sevKey = result.severity || 'healthy';
  const sevWord = t.severityWords[sevKey] || sevKey;
  const sevBadge = document.getElementById('res-sev-badge');
  const sevFill = document.getElementById('res-sev-fill');
  const affPct = document.getElementById('res-affected-pct');
  const pxCount = document.getElementById('res-pixel-count');

  if (sevBadge) {
    sevBadge.textContent = sevWord;
    sevBadge.className = 'sev-value sev-' + sevKey;
  }
  if (sevFill) {
    const pct = result.affectedPercentage || 0;
    sevFill.style.width = Math.min(100, Math.max(5, pct)) + '%';
    sevFill.className = 'sev-bar-fill fill-' + sevKey;
  }
  if (affPct) affPct.textContent = `${result.affectedPercentage || 0}%`;
  if (pxCount) pxCount.textContent = `Analyzed: ${(result.leafPixelCount || 48400).toLocaleString()} pixels`;

  // Prescription Tabs Content
  document.getElementById('res-summary-text').textContent = langData.summary || 'Summary not available.';
  document.getElementById('res-dosage-text').textContent = langData.dosage || 'Dosage info not available.';
  document.getElementById('res-chemical-text').textContent = langData.chemical || 'No chemical fungicide required.';
  document.getElementById('res-organic-text').textContent = langData.organic || 'Maintain balanced nutrition.';

  // Resistant Varieties Tab
  const varietiesContainer = document.getElementById('res-varieties-container');
  if (varietiesContainer) {
    varietiesContainer.innerHTML = '';
    const varList = diseaseData.resistantVarieties || [];
    if (varList.length > 0) {
      varList.forEach(v => {
        const item = document.createElement('div');
        item.className = 'variety-card-item';
        item.innerHTML = `
          <div class="variety-name-row">
            <span class="v-icon">🌾</span>
            <span class="v-name">${v.name}</span>
            <span class="v-region">${v.region}</span>
          </div>
          <p class="v-features">${v.features}</p>
        `;
        varietiesContainer.appendChild(item);
      });
    } else {
      varietiesContainer.innerHTML = '<p class="empty-tab-hint">Standard recommended wheat varieties are suitable.</p>';
    }
  }

  // Prevention Tab
  const prevList = document.getElementById('res-prevention-list');
  if (prevList) {
    prevList.innerHTML = '';
    const prevArr = langData.prevention || diseaseData.en?.prevention || [];
    prevArr.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="bullet-icon">🛡️</span><span>${p}</span>`;
      prevList.appendChild(li);
    });
  }

  switchRxTab('summary');
}

// ================= IMAGE VIEW MODE SWITCHER =================
function setImageViewMode(mode) {
  appState.viewMode = mode;
  const rawBtn = document.getElementById('btn-mode-raw');
  const heatBtn = document.getElementById('btn-mode-heatmap');
  const leafImg = document.getElementById('res-leaf-image');
  const heatImg = document.getElementById('res-heatmap-overlay');

  if (mode === 'raw') {
    rawBtn.classList.add('active');
    heatBtn.classList.remove('active');
    leafImg.style.display = 'block';
    heatImg.style.display = 'none';
  } else {
    rawBtn.classList.remove('active');
    heatBtn.classList.add('active');
    leafImg.style.display = 'none';
    heatImg.style.display = 'block';
  }
}

// ================= TREATMENT TABS SWITCHER =================
function switchRxTab(tabId) {
  document.querySelectorAll('.rx-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.rx-tab-pane').forEach(pane => pane.classList.remove('active'));

  const activeBtn = document.getElementById('tab-btn-' + tabId);
  const activePane = document.getElementById('pane-' + tabId);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');
}

// ================= AUDIO PRESCRIPTION (TTS) =================
let speechSynthesisSynth = null;
let currentUtterance = null;

function initSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    speechSynthesisSynth = window.speechSynthesis;
  }
}

function toggleAudioPrescription() {
  if (appState.isSpeaking) {
    stopAudio();
  } else {
    playAudioPrescription();
  }
}

async function playAudioPrescription() {
  if (!appState.currentResult) return;
  const lang = appState.lang;
  const t = i18n[lang] || i18n['hi'];
  const diseaseData = appState.currentResult.diseaseData || {};
  const langData = diseaseData[lang] || diseaseData['en'] || {};

  const name = langData.name || 'Wheat Condition';
  const remedy = langData.remedy || langData.summary || '';
  const chemical = langData.chemical || '';
  const speechText = `${name}. ${remedy}. ${chemical}`;

  setAudioPlayingState(true);

  // Attempt backend gTTS streaming first
  try {
    const audioEl = document.getElementById('prescription-audio-element');
    audioEl.src = `/api/tts?lang=${lang}&text=` + encodeURIComponent(speechText);
    audioEl.onended = () => setAudioPlayingState(false);
    audioEl.onerror = () => fallbackWebSpeech(speechText, lang);
    await audioEl.play();
  } catch (e) {
    fallbackWebSpeech(speechText, lang);
  }
}

function fallbackWebSpeech(text, lang) {
  if (!('speechSynthesis' in window)) {
    setAudioPlayingState(false);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.92;
  utterance.onend = () => setAudioPlayingState(false);
  utterance.onerror = () => setAudioPlayingState(false);
  window.speechSynthesis.speak(utterance);
}

function stopAudio() {
  const audioEl = document.getElementById('prescription-audio-element');
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  setAudioPlayingState(false);
}

function setAudioPlayingState(isPlaying) {
  appState.isSpeaking = isPlaying;
  const playIcon = document.getElementById('icon-play');
  const pauseIcon = document.getElementById('icon-pause');
  const wave = document.getElementById('audio-wave');
  const desc = document.getElementById('txt-voice-status');
  const t = i18n[appState.lang] || i18n['hi'];

  if (isPlaying) {
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
    if (wave) wave.style.display = 'flex';
    if (desc) desc.textContent = t.voicePlaying;
  } else {
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (wave) wave.style.display = 'none';
    if (desc) desc.textContent = t.voiceIdle;
  }
}

// ================= SCAN HISTORY =================
function loadScanHistory() {
  try {
    const raw = localStorage.getItem('wheat_doctor_prototype_history');
    if (raw) appState.scanHistory = JSON.parse(raw);
  } catch (e) {}
  renderHistoryDrawer();
}

function saveScanToHistory(result) {
  const item = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    diseaseTitle: result.diseaseData?.[appState.lang]?.name || result.diseaseKey,
    severity: result.severity,
    confidence: result.confidence,
    image: appState.currentImageBase64
  };
  appState.scanHistory.unshift(item);
  if (appState.scanHistory.length > 20) appState.scanHistory.pop();
  try {
    localStorage.setItem('wheat_doctor_prototype_history', JSON.stringify(appState.scanHistory));
  } catch (e) {}
  renderHistoryDrawer();
}

function renderHistoryDrawer() {
  const list = document.getElementById('history-list');
  if (!list) return;

  if (appState.scanHistory.length === 0) {
    list.innerHTML = '<p class="empty-history">No scans recorded yet. Test a wheat sample!</p>';
    return;
  }

  list.innerHTML = '';
  appState.scanHistory.forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-item-card';
    card.innerHTML = `
      <img class="history-thumb" src="${item.image}" alt="Scan leaf">
      <div class="history-info">
        <h4 class="history-title">${item.diseaseTitle}</h4>
        <div class="history-meta">
          <span class="history-badge sev-${item.severity}">${item.severity}</span>
          <span class="history-date">${item.date}</span>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function toggleHistoryDrawer() {
  const backdrop = document.getElementById('history-backdrop');
  if (backdrop) {
    backdrop.style.display = backdrop.style.display === 'none' ? 'block' : 'none';
  }
}

// ================= MOBILE SHARING & QR MODAL =================
async function initNetworkInfo() {
  try {
    const res = await fetch('/api/network-info');
    const data = await res.json();
    if (data.status === 'success') {
      const shareUrl = data.public_url || data.local_url;
      const input = document.getElementById('modal-link-input');
      const qrImg = document.getElementById('modal-qr-img');
      const notice = document.getElementById('modal-tunnel-text');

      if (input) input.value = shareUrl;
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`;
      }
      if (notice) {
        if (data.is_public_active) {
          notice.textContent = '🌐 Public HTTPS Access Active (Worldwide / 4G / 5G)';
          const dot = document.getElementById('nav-global-dot');
          if (dot) dot.style.background = '#22c55e';
        } else {
          notice.textContent = `🏠 Local Wi-Fi: Connect phone to the same Wi-Fi (${data.local_ip})`;
        }
      }
    }
  } catch (e) {
    console.warn('Network info unavailable:', e);
  }
}

function openMobileModal() {
  const modal = document.getElementById('mobile-modal');
  if (modal) modal.style.display = 'flex';
  initNetworkInfo();
}

function closeMobileModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('mobile-modal');
  if (modal) modal.style.display = 'none';
}

function copyShareLink() {
  const input = document.getElementById('modal-link-input');
  if (input) {
    input.select();
    navigator.clipboard.writeText(input.value);
    const btn = document.querySelector('.btn-copy');
    if (btn) {
      btn.textContent = '✅ Copied!';
      setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
    }
  }
}
