# package-viewer
a simple web application to monitor unencrypted http traffic with wireshark

## TL;DR

```bash
# Use python2
python -m pip install "Flask>=0.10.1,<0.11" "Flask-SocketIO>=2.3,<3" "gevent" "gevent-websocket" "pyshark"
python -m packageviewer.app "[ethernet interface device name e.g. eth0, Wi-Fi]"
```
