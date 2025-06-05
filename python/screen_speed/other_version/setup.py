#!/usr/bin/env python3
"""
Setup script for Speed Monitor App
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    requirements = [
        'matplotlib',
        'numpy',
        'requests',
        'gpsd-py3'
    ]
    
    for package in requirements:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"✓ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"✗ Failed to install {package}")

def setup_gps():
    """Setup GPS daemon (Linux only)"""
    if sys.platform.startswith('linux'):
        print("\nGPS Setup Instructions:")
        print("1. Install gpsd: sudo apt-get install gpsd gpsd-clients")
        print("2. Start gpsd: sudo gpsd /dev/ttyUSB0 -F /var/run/gpsd.sock")
        print("3. Test with: cgps")
    else:
        print("\nGPS functionality requires Linux with gpsd")

if __name__ == "__main__":
    print("Setting up Speed Monitor App...")
    install_requirements()
    setup_gps()
    print("\nSetup complete! Run: python screen_speed.py")