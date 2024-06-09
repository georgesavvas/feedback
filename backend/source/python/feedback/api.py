import time
from uuid import uuid4

from feedback.tools import get_issues_collection, get_rfe_collection, get_admins_collection
from feedback.tools import get_logger


LOGGER = get_logger(__name__)
COLLECTIONS = {
    "issues": get_issues_collection,
    "rfe": get_rfe_collection,
}


def get_posts(kind, service):
    coll = COLLECTIONS[kind](service)
    posts = coll.find({"parent": {"$exists" : False}}, {"_id": False})
    return list(posts)


def get_admins(service):
    coll = get_admins_collection(service)
    admins = coll.find({"service": service}, {"_id": False})
    return list(admins)


def set_admins(service, admins):
    coll = get_admins_collection(service)
    upsert = coll.update_one({"service": service}, {"$set": admins}, upsert=True)
    return True


def create_post(kind, service, content, user, status, tags):
    coll = COLLECTIONS[kind](service)
    post_id = str(uuid4())
    now = time.time()
    data = {
        "id": post_id,
        "content": content,
        "user": user,
        "tags": tags,
        "created": now,
        "modified": now,
        "tags": tags,
        "status": status,
        "comments": []
    }
    upsert = coll.update_one({"id": post_id}, {"$set": data}, upsert=True)
    LOGGER.info(upsert)
    return True


def update_post(kind, service, post_id, user, content=None, status=None, tags=None):
    coll = COLLECTIONS[kind](service)
    now = time.time()
    data = {
        "modified": now,
        "modified_by": user,
    }
    if content != None:
        data["content"] = content
    if status != None:
        data["status"] = status
    if tags != None:
        data["tags"] = tags
    upsert = coll.update_one({"id": post_id}, {"$set": data}, upsert=True)
    LOGGER.info(upsert)
    return True


def create_comment(kind, service, post_id, content, user):
    coll = COLLECTIONS[kind](service)
    comment_id = str(uuid4())
    now = time.time()
    data = {
        "id": comment_id,
        "content": content,
        "user": user,
        "created": now,
        "modified": now,
    }
    upsert = coll.update_one(
        {"id": post_id},
        {"$push": {"comments": data}}
    )
    LOGGER.info(upsert)
    return True


def update_comment(kind, service, post_id, comment_id, content, user):
    coll = COLLECTIONS[kind](service)
    now = time.time()
    data = {
        "content": content,
        "modified": now,
        "modified_by": user,
    }
    upsert = coll.update_one(
        {"id": post_id, "comments.comment_id": comment_id},
        {"$set": {"comments.$": data}}
    )
    LOGGER.info(upsert)
    return True


def delete_post(kind, service, post_id, user):
    coll = COLLECTIONS[kind](service)
    coll.delete_one({"id": post_id})
    LOGGER.info(f"User {user['username']} deleted post {post_id}")
    return True
