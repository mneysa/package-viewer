from gevent import monkey
monkey.patch_all()
from gevent.server import StreamServer

from multiprocessing import Process, current_process
from hashlib import sha256
import socket
import pickle
import pyshark
from sys import argv

from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def main():
    return render_template("index.html")

def http_capturer(portnum):
    interface_name = argv[1]
    capture = pyshark.LiveCapture(interface=interface_name, display_filter="http.request.method")

    connection = socket.socket(family=socket.AF_INET, type=socket.SOCK_STREAM)
    connection.connect(('127.0.0.1', portnum))
    connection.send(sha256(current_process().authkey).digest())

    connfile = connection.makefile(mode='w')
    pickler = pickle.Pickler(connfile, protocol=pickle.HIGHEST_PROTOCOL)

    for packet in capture.sniff_continuously():
        data = {
            "time": str(packet.sniff_time),
            "method": str(packet.http.request_method),
            "url": str(packet.http.request_full_uri),
        }
        if hasattr(packet, "ip"):
            data.update({"source": str(packet.ip.src)})
        else:
            data.update({"source": str(packet.ipv6.src)})

        if hasattr(packet.http, "user_agent"):
            data.update({"user-agent": str(packet.http.user_agent)})
        else:
            data.update({"user-agent": None})

        if hasattr(packet, 'urlencoded-form'):
            data.update({"params": str(packet['urlencoded-form'])})
        else:
            data.update({"params": None})

        pickler.dump(data)
        connfile.flush()

def http_receiver(connection, address):
    (ip_addr, port) = address
    if ip_addr != '127.0.0.1':
        connection.close()
        return

    key = connection.recv(256)
    lkey = sha256(current_process().authkey).digest()
    if key != lkey:
        connection.close()
        print "wrong key from client: " + ip_addr + ":" + str(port)
        return

    unpickler = pickle.Unpickler(connection.makefile(mode='r'))
    try:
        while True:
            data = unpickler.load()
            socketio.emit('packet', data, namespace="/packets")
    finally:
        connection.close()

if __name__ == '__main__':
    StreamServer('127.0.0.1:5005', handle=http_receiver).start()

    capturer = Process(target=http_capturer, args=(5005,))
    capturer.start()

    socketio.run(app)
