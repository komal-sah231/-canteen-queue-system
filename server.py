#!/usr/bin/env python3
"""
CampusBite - Smart Queue Management for College Canteens
Local Development Server

Usage:
    python server.py [port]

Default URL:
    http://localhost:8000
"""

import http.server
import socketserver
import sys
import webbrowser
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CanteenHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable caching during development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), CanteenHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 65)
        print("🎓 CampusBite - Smart Queue Management for College Canteens")
        print("=" * 65)
        print(f"🚀 Serving application at: {url}")
        print(f"📁 Root directory: {DIRECTORY}")
        print("💡 Features included:")
        print("   - Student Portal (Menu, Cart, Estimated Pickup, Live Stepper)")
        print("   - Staff Kitchen Board (Status Progression, Rush Hour, Menu CRUD)")
        print("   - Real-time Multi-Tab Synchronizer & Web Audio Chimes")
        print("=" * 65)
        print("Press Ctrl+C to stop the server.\n")

        # Open browser automatically if possible
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")

if __name__ == '__main__':
    run_server()
