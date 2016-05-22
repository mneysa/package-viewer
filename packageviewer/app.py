from gevent import monkey, spawn
monkey.patch_all()

import shlex, subprocess
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def main():
    return render_template("index.html")

def yield_http_packages():
    command = r'"C:\Program Files\Wireshark\tshark.exe" -i 3 -T fields -e frame.time -e ip.src -e http.user_agent -e http.request.method -e http.host -e http.request.uri -e urlencoded-form.key -e urlencoded-form.value -Y http.request -l'
    args = shlex.split(command)
    proc = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

if __name__ == '__main__':
    socketio.run(app)
