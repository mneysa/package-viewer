from gevent import monkey
monkey.patch_all()

from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def main():
    return render_template("index.html")

@socketio.on('connect', namespace='/packages')
def ws_connect():
    socketio.emit('msg', 'connected', namespace='/packages')

if __name__ == '__main__':
    socketio.run(app)
