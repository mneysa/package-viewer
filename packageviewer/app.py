from gevent import monkey
monkey.patch_all()
from gevent.server import StreamServer

from multiprocessing import current_process
from hashlib import sha256

from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def main():
    return render_template("index.html")

def http_receiver(connection, address):
    if address != '127.0.0.1':
        connection.close()
        print "wrong ip: " + address
        return

    key = connection.recv(256)
    lkey = sha256(current_process().authkey).digest()
    if key != lkey:
        connection.close()
        print "wrong key!"
        return

if __name__ == '__main__':
    StreamServer('127.0.0.1:5005', handle=http_receiver).start()
    socketio.run(app)
