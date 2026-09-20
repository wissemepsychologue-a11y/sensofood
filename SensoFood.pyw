import os
import sys
import time
import threading
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)

from app import app


def open_browser():
    time.sleep(2)
    webbrowser.open("http://127.0.0.1:5000/")


threading.Thread(target=open_browser, daemon=True).start()

app.run(
    host="127.0.0.1",
    port=5000,
    debug=False,
    use_reloader=False
)