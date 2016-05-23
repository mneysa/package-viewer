#!/usr/bin/env python
from setuptools import setup

setup(
    name = 'INFSEC Package Viewer',
    version = '1.0',
    description = 'A simple web application to monitor unencrypted HTTP traffic with Wireshark.',
    url = 'https://github.com/shieldwed/package-viewer',
    author = 'INFSEC 2016 Team 84',
    author_email = 'shieldwed@outlook.com',
    license = 'MIT',
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Education',
        'Intended Audience :: Information Technology',
        'Intended Audience :: System Administrators',
        'License :: OSI Approved :: MIT License',
        'Operating System :: MacOS :: MacOS X',
        'Operating System :: Microsoft :: Windows',
        'Operating System :: POSIX',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: JavaScript',
        'Topic :: Education',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Scientific/Engineering :: Information Analysis',
        'Topic :: Security :: Cryptography',
        'Topic :: System :: Networking',
    ],
    packages = [
        'packageviewer',
    ],
    package_data = {
        'packageviewer' : [
            'templates/*.html',
            'static/*',
        ],
    },
    install_requires = [
        'Flask>=0.10.1,<0.11',
        'Flask-SocketIO>=2.3,<3',
        'gevent-websocket',
        'pyshark',
    ],
)
