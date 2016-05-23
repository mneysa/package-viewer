from multiprocessing import Process, Pipe

from gevent import monkey, spawn
monkey.patch_all(thread=False, socket=False)

import pyshark


from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def main():
    return render_template("index.html")

def http_capturer(pipe):
    capture = pyshark.LiveCapture(interface="Wi-Fi", display_filter="http.request")
    for package in capture.sniff_continuously():
        data = {
            "time": str(package.sniff_time),
            "source": str(package.ip.src),
            "method": str(package.http.request_method),
            "url": str(package.http.request_full_uri),
        }
        if hasattr(package.http, "user_agent"):
            data.update({"user-agent": str(package.http.user_agent)})
        else:
            data.update({"user-agent": None})

        if hasattr(package, 'urlencoded-form'):
            data.update({"params": str(package['urlencoded-form'])})
        else:
            data.update({"params": None})

        pipe.send(data)


def http_receiver():
    recv_conn, send_conn = Pipe()
    capturer = Process(target=http_capturer, args=(send_conn,))
    capturer.start()
    while True:
        print recv_conn.recv()

if __name__ == '__main__':
    # spawn(http_receiver)
    # socketio.run(app)
    http_receiver()
