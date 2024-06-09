# -*- coding: utf-8 -*-

name = "feedback_ui"

version = open("VERSION").read().strip()

uuid = "4b5f5bf5-b648-493f-914f-972f274db3bf"

description = ""

requires = []

build_command = "{root}/build.sh"


def commands():
    env.PATH.append("{root}/bin")
