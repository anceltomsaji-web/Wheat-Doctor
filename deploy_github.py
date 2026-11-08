"""
Wheat Doctor AI - Automated GitHub & Android APK Deployment Helper
==================================================================
Builds the latest Android WebView & PWA bundles, stages and commits all files,
configures the GitHub remote repository URL, and pushes to the 'main' branch
to trigger automated Android APK compilation via GitHub Actions.
"""

import os
import re
import subprocess
import sys


def run_cmd(cmd, check=False, capture=False):
    """Run a shell command safely in the project root directory."""
    if capture:
        return subprocess.run(
            cmd,
            cwd=PROJECT_ROOT,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=check,
        )
    return subprocess.run(cmd, cwd=PROJECT_ROOT, check=check)


PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))


def get_existing_remote():
    res = run_cmd(["git", "remote", "get-url", "origin"], capture=True)
    if res.returncode == 0 and res.stdout.strip():
        return res.stdout.strip()
    return ""


def parse_github_slug(repo_url):
    """Extract 'owner/repo' from a GitHub HTTPS or SSH URL."""
    cleaned = repo_url.strip().strip('"').strip("'").rstrip("/")
    if cleaned.endswith(".git"):
        cleaned = cleaned[:-4]
    match = re.search(r"github\.com[:/]([^/]+/[^/]+)$", cleaned, re.IGNORECASE)
    if match:
        return match.group(1)
    return None


def ensure_git_identity():
    """Ensure local git user.name and user.email exist so commit never fails."""
    name_res = run_cmd(["git", "config", "user.name"], capture=True)
    email_res = run_cmd(["git", "config", "user.email"], capture=True)
    if name_res.returncode != 0 or not name_res.stdout.strip():
        run_cmd(["git", "config", "user.name", "Wheat Doctor Developer"])
    if email_res.returncode != 0 or not email_res.stdout.strip():
        run_cmd(["git", "config", "user.email", "developer@wheatdoctor.ai"])


def main():
    dry_run = "--dry-run" in sys.argv
    cli_url = None
    for arg in sys.argv[1:]:
        if not arg.startswith("--"):
            cli_url = arg.strip()

    print("=" * 70)
    print("   WHEAT DOCTOR AI - GITHUB AND ANDROID APK DEPLOYMENT HELPER")
    print("=" * 70)
    print()

    # Step 1: Build Android & PWA static bundles
    print("[Step 1/3] Building latest Android WebView and PWA static bundles...")
    build_res = run_cmd([sys.executable, "build_android_bundle.py"])
    if build_res.returncode != 0:
        print("\n[ERROR] Bundle build failed! Please check the output above.")
        return 1

    # Step 2: Stage and commit all files
    print("\n[Step 2/3] Staging and committing project files for GitHub...")
    ensure_git_identity()
    run_cmd(["git", "add", "-A"])
    status_res = run_cmd(["git", "status", "-s"], capture=True)
    if status_res.stdout.strip():
        print(status_res.stdout.rstrip())
        commit_res = run_cmd(
            [
                "git",
                "commit",
                "-m",
                "Build Wheat Doctor v2.0 Android APK, PWA and On-Device Vision Engine",
            ],
            capture=True,
        )
        if commit_res.returncode == 0:
            print("  -> Committed latest project changes.")
        else:
            print(commit_res.stdout.rstrip())
    else:
        print("  -> Working tree is already clean and committed.")

    run_cmd(["git", "branch", "-M", "main"])

    if dry_run:
        print("\n[DRY RUN] Build and Git staging verified successfully!")
        return 0

    # Step 3: Configure GitHub Remote URL
    existing_remote = get_existing_remote()
    print("\n" + "=" * 70)
    print(" Enter your GitHub Repository URL")
    print(" Example: https://github.com/YourUsername/Wheat-Doctor.git")
    if existing_remote:
        print(f" Current 'origin' remote: {existing_remote}")
        print(" (Press Enter to keep the current remote, or paste a new URL)")
    print("=" * 70)

    if cli_url is not None:
        repo_url = cli_url
    else:
        try:
            repo_url = input("GitHub Repo URL: ").strip().strip('"').strip("'")
        except EOFError:
            repo_url = ""

    if repo_url:
        # Normalize GitHub URL if pasted without .git
        if "github.com/" in repo_url and not repo_url.endswith(".git"):
            repo_url = repo_url.rstrip("/") + ".git"
        run_cmd(["git", "remote", "remove", "origin"], capture=True)
        add_res = run_cmd(["git", "remote", "add", "origin", repo_url], capture=True)
        if add_res.returncode != 0:
            print(f"\n[ERROR] Could not set remote URL: {add_res.stdout}")
            return 1
        active_remote = repo_url
    else:
        active_remote = existing_remote

    if not active_remote:
        print("\n[!] No GitHub Repository URL was entered.")
        print("    Please create a new empty repository at https://github.com/new")
        print("    then run push_to_github.bat again and paste the repository URL.")
        return 1

    # Step 4: Push to GitHub
    print(f"\n[Step 3/3] Pushing to GitHub ({active_remote}) on branch 'main'...")
    push_res = run_cmd(["git", "push", "-u", "origin", "main"])
    if push_res.returncode != 0:
        print("\n[!] Normal push was rejected (remote may contain initial files like README).")
        print("    Retrying push with --force-with-lease / --force to sync repository...")
        push_res = run_cmd(["git", "push", "-u", "origin", "main", "--force"])

    if push_res.returncode != 0:
        print("\n[!] Push could not complete. Please verify:")
        print("    1. The GitHub repository URL exists: " + active_remote)
        print("    2. You are signed in to GitHub in Git Credential Manager.")
        return 1

    slug = parse_github_slug(active_remote)
    print("\n" + "=" * 70)
    print(" [SUCCESS] Code pushed to GitHub!")
    if slug:
        print(f" 1. Watch APK Build (GitHub Actions):")
        print(f"    https://github.com/{slug}/actions")
        print(f" 2. Download Android APK (~2 mins after build completes):")
        print(f"    https://github.com/{slug}/releases")
        print(f"    File: Wheat-Doctor-v2.0-Android.apk")
    else:
        print(" 1. Open your GitHub repository -> 'Actions' tab to watch the")
        print("    automated Android APK build ('Build Android APK & Release').")
        print(" 2. Once finished (~2 mins), open the 'Releases' section on your")
        print("    GitHub repo from your Android phone and download:")
        print("    >>> Wheat-Doctor-v2.0-Android.apk <<<")
    print("=" * 70)
    return 0


if __name__ == "__main__":
    sys.exit(main())
