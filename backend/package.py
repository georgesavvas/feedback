# -*- coding: utf-8 -*-

name = "feedback"

version = open("VERSION").read().strip()

uuid = "8193b56c-43ad-4493-93bd-6506342d4061"

description = ""

requires = [
    "pymongo",
    "uvicorn",
    "fastapi",
]

build_command = "{root}/build.sh"


def commands():
    global env
    env.PATH.append("{root}/bin")
    env.PYTHONPATH.append("{root}/python")
