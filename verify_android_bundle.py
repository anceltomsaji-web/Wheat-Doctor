import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def verify_all_bundles():
    print("=" * 65)
    print("   WHEAT DOCTOR v2.0 — ANDROID APK & GITHUB BUNDLE VERIFIER")
    print("=" * 65)

    required_files = [
        ".gitignore",
        ".github/workflows/android-apk.yml",
        ".github/workflows/deploy-pages.yml",
        "android/settings.gradle",
        "android/build.gradle",
        "android/gradle.properties",
        "android/app/build.gradle",
        "android/app/src/main/AndroidManifest.xml",
        "android/app/src/main/java/com/wheatdoctor/ai/MainActivity.java",
        "android/app/src/main/res/values/strings.xml",
        "android/app/src/main/res/values/styles.xml",
        "android/app/src/main/res/mipmap-mdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-hdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png",
        "android/app/src/main/assets/www/index.html",
        "android/app/src/main/assets/www/manifest.json",
        "android/app/src/main/assets/www/sw.js",
        "android/app/src/main/assets/www/static/vision_engine.js",
        "android/app/src/main/assets/www/static/app.js",
        "android/app/src/main/assets/www/static/style.css",
        "android/app/src/main/assets/www/static/samples/wheat_healthy.jpg",
        "android/app/src/main/assets/www/static/samples/wheat_stripe_rust.jpg",
        "android/app/src/main/assets/www/static/samples/wheat_leaf_rust.jpg",
        "android/app/src/main/assets/www/static/samples/wheat_powdery_mildew.jpg",
        "android/app/src/main/assets/www/static/samples/wheat_septoria_blotch.jpg",
        "dist/index.html",
        "dist/manifest.json",
        "dist/sw.js",
        "dist/static/vision_engine.js",
        "static/vision_engine.js",
        "prototype/static/vision_engine.js",
        "PROJECT_REPORT.md",
        "push_to_github.bat"
    ]

    for rel_path in required_files:
        full_path = os.path.join(BASE_DIR, rel_path)
        assert os.path.exists(full_path), f"Missing required file: {rel_path}"
        size = os.path.getsize(full_path)
        assert size > 0, f"Empty file: {rel_path}"
        print(f" [OK] {rel_path:<62} ({size:,} bytes)")

    # Verify standalone index.html uses relative paths for Android WebView & GitHub Pages
    with open(os.path.join(BASE_DIR, "android/app/src/main/assets/www/index.html"), "r", encoding="utf-8") as f:
        android_html = f.read()
    assert 'src="static/vision_engine.js"' in android_html, "Missing relative vision_engine.js in Android HTML"
    assert 'src="static/app.js"' in android_html, "Missing relative app.js in Android HTML"
    assert 'href="static/style.css"' in android_html, "Missing relative style.css in Android HTML"
    print("\n [OK] Android WebView HTML verified (relative asset paths & vision_engine.js active)")

    # Verify manifest.json validity
    with open(os.path.join(BASE_DIR, "manifest.json"), "r", encoding="utf-8") as f:
        manifest_data = json.load(f)
    assert manifest_data["display"] == "standalone"
    assert len(manifest_data["icons"]) >= 2
    print(" [OK] PWA manifest.json verified")

    print("\n" + "=" * 65)
    print(" [SUCCESS] ALL ANDROID APK & GITHUB BUNDLE CHECKS PASSED (100% OK)")
    print("=" * 65)

if __name__ == "__main__":
    verify_all_bundles()

