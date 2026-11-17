"""
Train the "is this a WHEAT plant?" head used by static/wheat_classifier.js
=========================================================================

Backbone : MobileNetV2 (ImageNet) TF-Hub feature vector, run in the browser engine itself
           (static/models/mobilenet_v2_fv) so train-time and run-time features are identical.
Head     : L2-normalised 1280-d embedding -> StandardScaler -> Logistic Regression.
Decision : probability = min(p(full frame), p(centre crop)) >= threshold

Usage:
    python train_wheat_classifier.py <embeddings.jsonl> [--out static/models/wheat_head.json]
"""
import json
import os
import sys

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.preprocessing import StandardScaler

TARGET_SPECIFICITY = 0.985

HARD_NEG_KEYWORDS = (
    "hard_neg/", "lawn_grass", "maize", "corn", "rice_plant", "bamboo",
    "sugarcane", "pothole_leaf", "houseplant", "cabbage", "cucumber", "rose_leaf",
)


def load(paths):
    items = {}
    for p in paths:
        with open(p, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                for it in json.loads(line):
                    kid = it["id"]
                    low = kid.lower()
                    # Filter noisy positives so only genuine wheat leaf/plant photos are positive
                    if kid.startswith("wheat/"):
                        if "field" in low or not any(w in low for w in ("leaf", "rust", "mildew", "triticum")):
                            continue
                    if kid.startswith("pos_gh/"):
                        if not any(w in low for w in ("wheat_health", "wheat_leaf_r")):
                            continue
                    if "/app_" in kid or kid.startswith("app_"):
                        it["weight"] = 12.0
                    elif any(k in low for k in HARD_NEG_KEYWORDS):
                        it["weight"] = 15.0
                    items[kid] = it
    return list(items.values())


def build(items):
    X, y, g, v, w = [], [], [], [], []
    for gi, it in enumerate(items):
        for vi, e in enumerate(it["embs"]):
            X.append(e)
            y.append(it["label"])
            g.append(gi)
            v.append(vi)
            w.append(it.get("weight", 1.0))
    return np.asarray(X, np.float32), np.asarray(y), np.asarray(g), np.asarray(v), np.asarray(w, np.float32)


def fit(X, y, w, C):
    sc = StandardScaler().fit(X)
    clf = LogisticRegression(C=C, max_iter=3000, class_weight="balanced")
    clf.fit(sc.transform(X), y, sample_weight=w)
    return sc, clf


def image_scores(sc, clf, X, g, v):
    """min(p_view0, p_view1) per image group."""
    p = clf.predict_proba(sc.transform(X))[:, 1]
    out = {}
    for pi, gi, vi in zip(p, g, v):
        if vi in (0, 1):
            out.setdefault(gi, []).append(pi)
    return {gi: min(vals) for gi, vals in out.items()}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    out = "static/models/wheat_head.json"
    if "--out" in sys.argv:
        out = sys.argv[sys.argv.index("--out") + 1]
        args = [a for a in args if a != out]
    items = load(args)
    X, y, g, v, w = build(items)
    labels = {gi: it["label"] for gi, it in enumerate(items)}
    n_pos = sum(1 for it in items if it["label"] == 1)
    print("images: %d wheat, %d non-wheat; samples: %d" % (n_pos, len(items) - n_pos, len(X)))

    best = None
    for C in (0.01, 0.03, 0.05, 0.1, 0.2):
        skf = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
        oof = {}
        for tr, te in skf.split(X, y, g):
            sc, clf = fit(X[tr], y[tr], w[tr], C)
            oof.update(image_scores(sc, clf, X[te], g[te], v[te]))
        gi_sorted = sorted(oof)
        s = np.array([oof[i] for i in gi_sorted])
        t = np.array([labels[i] for i in gi_sorted])
        neg = np.sort(s[t == 0])
        k = int(np.ceil(TARGET_SPECIFICITY * len(neg))) - 1
        thr = float(min(0.92, max(0.62, neg[k] + 1e-6)))
        recall = float((s[t == 1] >= thr).mean())
        spec = float((s[t == 0] < thr).mean())
        print("C=%-6g thr=%.3f  wheat recall=%.3f  non-wheat rejected=%.3f" % (C, thr, recall, spec))
        if best is None or recall > best[0]:
            best = (recall, C, thr, spec)

    recall, C, thr, spec = best
    print("chosen C=%g threshold=%.3f (cv wheat recall %.3f, non-wheat rejection %.3f)" % (C, thr, recall, spec))

    sc, clf = fit(X, y, w, C)
    full_scores = image_scores(sc, clf, X, g, v)
    for gi, it in enumerate(items):
        if it["id"].startswith(("app_pos/", "app_neg/", "hard_neg/")):
            print("  %-38s prob=%.4f (thr=%.3f)" % (it["id"], full_scores[gi], thr))

    head = {
        "version": 2,
        "backbone": "mobilenet_v2_100_224 feature_vector (TF-Hub, input range [0,1])",
        "weights": [round(float(x), 6) for x in clf.coef_[0]],
        "bias": round(float(clf.intercept_[0]), 6),
        "mean": [round(float(x), 6) for x in sc.mean_],
        "scale": [round(float(x), 6) for x in sc.scale_],
        "threshold": round(thr, 4),
        "cv_wheat_recall": round(recall, 4),
        "cv_target_specificity": round(spec, 4),
        "trained_on": {"wheat_images": n_pos, "non_wheat_images": len(items) - n_pos},
    }
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(head, f, separators=(",", ":"))
    print("wrote", out, os.path.getsize(out), "bytes")


if __name__ == "__main__":
    main()
