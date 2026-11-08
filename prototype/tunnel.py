import os
import sys
import time
import subprocess
import threading
import re
import urllib.request

PUBLIC_URL = None
TUNNEL_PROCESS = None
TUNNEL_STATUS = "stopped"

# Check local prototype dir or parent dir for cloudflared.exe
LOCAL_CLOUDFLARED = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cloudflared.exe")
PARENT_CLOUDFLARED = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cloudflared.exe")
CLOUDFLARED_DOWNLOAD_URL = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"

def ensure_cloudflared():
    """Locate or download cloudflared on Windows."""
    if os.path.exists(LOCAL_CLOUDFLARED) and os.path.getsize(LOCAL_CLOUDFLARED) > 1000000:
        return LOCAL_CLOUDFLARED
    if os.path.exists(PARENT_CLOUDFLARED) and os.path.getsize(PARENT_CLOUDFLARED) > 1000000:
        return PARENT_CLOUDFLARED
    
    print("[Tunnel] cloudflared.exe not found. Downloading Cloudflare Quick Tunnel...")
    try:
        urllib.request.urlretrieve(CLOUDFLARED_DOWNLOAD_URL, LOCAL_CLOUDFLARED)
        print("[Tunnel] cloudflared.exe downloaded successfully!")
        return LOCAL_CLOUDFLARED
    except Exception as e:
        print(f"[Tunnel] Failed to download cloudflared: {e}")
        return None

def start_cloudflare_tunnel(port=5000):
    global PUBLIC_URL, TUNNEL_PROCESS, TUNNEL_STATUS
    exe_path = ensure_cloudflared()
    if not exe_path:
        return None

    TUNNEL_STATUS = "starting"
    print(f"[Tunnel] Starting Cloudflare HTTPS tunnel for port {port}...")

    cmd = [exe_path, "tunnel", "--url", f"http://127.0.0.1:{port}", "--no-autoupdate"]
    
    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        TUNNEL_PROCESS = process

        url_found_event = threading.Event()

        def read_stderr():
            global PUBLIC_URL, TUNNEL_STATUS
            url_pattern = re.compile(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com')
            for line in process.stderr:
                match = url_pattern.search(line)
                if match:
                    PUBLIC_URL = match.group(0)
                    TUNNEL_STATUS = "running"
                    url_found_event.set()

        t = threading.Thread(target=read_stderr, daemon=True)
        t.start()

        # Wait up to 15 seconds for URL
        url_found = url_found_event.wait(timeout=15)
        if url_found and PUBLIC_URL:
            print("=" * 65)
            print(" [PUBLIC INTERNET ACCESS ACTIVE - ANY NETWORK]")
            print(f" Anyone on ANY network (4G/5G/Wi-Fi) can access via:")
            print(f" >>> {PUBLIC_URL} <<<")
            print("=" * 65)
            return PUBLIC_URL
        else:
            print("[Tunnel] Cloudflare quick tunnel did not provide a URL in time.")
            return None
    except Exception as e:
        print(f"[Tunnel] Error launching cloudflared: {e}")
        return None

def start_ssh_pinggy_tunnel(port=5000):
    global PUBLIC_URL, TUNNEL_PROCESS, TUNNEL_STATUS
    print(f"[Tunnel] Trying SSH Pinggy tunnel fallback on port {port}...")
    try:
        cmd = ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", "-R", f"80:localhost:{port}", "a.pinggy.io"]
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        TUNNEL_PROCESS = process
        url_pattern = re.compile(r'https://[a-zA-Z0-9-]+\.a\.pinggy\.link')
        url_found_event = threading.Event()

        def read_output():
            global PUBLIC_URL, TUNNEL_STATUS
            for line in process.stdout:
                match = url_pattern.search(line)
                if match:
                    PUBLIC_URL = match.group(0)
                    TUNNEL_STATUS = "running"
                    url_found_event.set()

        t = threading.Thread(target=read_output, daemon=True)
        t.start()

        url_found = url_found_event.wait(timeout=12)
        if url_found and PUBLIC_URL:
            print(f"[Tunnel] SSH Pinggy public URL: {PUBLIC_URL}")
            return PUBLIC_URL
    except Exception as e:
        print(f"[Tunnel] SSH tunnel failed: {e}")
    return None

def start_tunnel_async(port=5000):
    """Starts tunnel in a background thread."""
    def _run():
        url = start_cloudflare_tunnel(port)
        if not url:
            start_ssh_pinggy_tunnel(port)
    
    t = threading.Thread(target=_run, daemon=True)
    t.start()

def get_public_url():
    global PUBLIC_URL
    return PUBLIC_URL

def stop_tunnel():
    global TUNNEL_PROCESS, TUNNEL_STATUS, PUBLIC_URL
    if TUNNEL_PROCESS:
        try:
            TUNNEL_PROCESS.terminate()
        except Exception:
            pass
        TUNNEL_PROCESS = None
    TUNNEL_STATUS = "stopped"
    PUBLIC_URL = None
