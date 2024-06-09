import os
import logging
from pprint import pprint

import pymongo

from feedback.log_formatter import LogFormatter


LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(LogFormatter())
LOGGER.handlers = []
LOGGER.addHandler(ch)
LOGGER.propagate = False


ENV = os.environ
MONGO_URL = ENV.get("MONGO_URL")
MONGODB = pymongo.MongoClient(f"mongodb://{MONGO_URL}/")


def log_request(request):
    pprint(request, compact=True)
    LOGGER.info("")


def error(s=""):
    return {"ok": False, "error": s}


def get_logger(name):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(LogFormatter())
    logger.handlers = []
    logger.addHandler(ch)
    logger.propagate = False
    return logger


def get_db():
    db = MONGODB["feedback"]
    return db


def get_issues_collection(service):
    db = get_db()
    coll = db[f"issues-{service}"]
    return coll


def get_rfe_collection(service):
    db = get_db()
    coll = db[f"rfe-{service}"]
    return coll


def get_admins_collection(service):
    db = get_db()
    coll = db[f"admins"]
    return coll
