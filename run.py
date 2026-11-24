#!/usr/bin/env python3
"""
BrandPilot — One-Command Master Launcher
Starts the Supabase provisioning, FastAPI backend, and Next.js frontend concurrently.
Automatically opens your browser to the BrandPilot platform.
"""

import os
import sys
import time
import subprocess
import webbrowser
import signal
from pathlib import Path

# Resolve base directories
ROOT_DIR = Path(__file__).resolve().parent
if (ROOT_DIR / "brandpilot").exists():
    BRANDPILOT_DIR = ROOT_DIR / "brandpilot"
else:
    BRANDPILOT_DIR = ROOT_DIR

BACKEND_DIR = BRANDPILOT_DIR / "backend"
FRONTEND_DIR = BRANDPILOT_DIR / "frontend"

# Virtual environment python binary
if os.name == "nt":
    VENV_PYTHON = BACKEND_DIR / ".venv" / "Scripts" / "python.exe"
    NPM_CMD = "npm.cmd"
else:
    VENV_PYTHON = BACKEND_DIR / ".venv" / "bin" / "python"
    NPM_CMD = "npm"

if not VENV_PYTHON.exists():
    VENV_PYTHON = Path(sys.executable)


def banner():
    print("""
======================================================================
  ____                      _ ____  _ _       _   
 | __ ) _ __ __ _ _ __   __| |  _ \(_) | ___ | |_ 
 |  _ \| '__/ _` | '_ \ / _` | |_) | | |/ _ \| __|
 | |_) | | | (_| | | | | (_| |  __/| | | (_) | |_ 
 |____/|_|  \__,_|_| |_|\__,_|_|   |_|_|\___/ \__|
                                                   
  AI-Assisted Brand Governance for Everyday Content Teams
======================================================================
""")


def setup_database():
    """Runs automated Supabase database provisioning and env sync"""
    setup_script = BRANDPILOT_DIR / "setup_supabase.py"
    if setup_script.exists():
        print("[1/3] Checking Supabase & Database configurations...")
        subprocess.run([str(VENV_PYTHON), str(setup_script)], check=False)
        print("✓ Database initialization complete.\n")


def start_servers():
    banner()
    setup_database()

    processes = []

    try:
        # 1. Start FastAPI Backend
        print("[2/3] Launching FastAPI Backend on http://localhost:8000...")
        backend_env = os.environ.copy()
        backend_env["PYTHONPATH"] = str(BACKEND_DIR)

        backend_proc = subprocess.Popen(
            [str(VENV_PYTHON), "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"],
            cwd=str(BACKEND_DIR),
            env=backend_env
        )
        processes.append(backend_proc)

        # 2. Start Next.js Frontend
        print("[3/3] Launching Next.js Frontend on http://localhost:3000...")
        frontend_proc = subprocess.Popen(
            [NPM_CMD, "run", "dev"],
            cwd=str(FRONTEND_DIR),
            shell=(os.name == "nt")
        )
        processes.append(frontend_proc)

        print("\n" + "=" * 65)
        print("🚀 BrandPilot is up and running!")
        print("   • Web App:     http://localhost:3000")
        print("   • Backend API: http://localhost:8000")
        print("   • API Docs:    http://localhost:8000/docs")
        print("=" * 65)
        print("Press Ctrl+C at any time to stop all servers.\n")

        # Wait a moment for Next.js and FastAPI to bind ports, then open browser
        time.sleep(3)
        try:
            webbrowser.open("http://localhost:3000")
        except Exception:
            pass

        # Keep parent alive and monitor children
        while True:
            for p in processes:
                if p.poll() is not None:
                    # One of the processes crashed or stopped
                    print(f"Process {p.args} exited with code {p.returncode}")
                    return
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nStopping all BrandPilot servers gracefully...")
    finally:
        for p in processes:
            try:
                if os.name == "nt":
                    subprocess.run(["taskkill", "/F", "/T", "/PID", str(p.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    p.terminate()
            except Exception:
                pass
        print("✓ All servers stopped successfully.")


if __name__ == "__main__":
    start_servers()
