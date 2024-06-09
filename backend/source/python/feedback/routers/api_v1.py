import os
from pprint import pprint

from fastapi import APIRouter, Request

from feedback import api
from feedback.tools import get_logger, log_request


LOGGER = get_logger(__name__)

router = APIRouter()


@router.post("/get_posts")
async def get_posts(request: Request):
    result = await request.json()
    log_request(result)
    data = api.get_posts(**result)
    return {
        "ok": True,
        "data": data,
    }


@router.post("/get_admins")
async def get_admins(request: Request):
    result = await request.json()
    log_request(result)
    data = api.get_admins(**result)
    return {
        "ok": True,
        "data": data,
    }


@router.post("/set_admins")
async def set_admins(request: Request):
    result = await request.json()
    log_request(result)
    ok = api.set_admins(**result)
    return {
        "ok": ok,
    }


@router.post("/create_post")
async def create_post(request: Request):
    result = await request.json()
    log_request(result)
    ok = api.create_post(**result)
    return {
        "ok": ok,
    }


@router.post("/update_post")
async def update_post(request: Request):
    result = await request.json()
    log_request(result)
    ok = api.update_post(**result)
    return {
        "ok": ok,
    }


@router.post("/delete_post")
async def delete_post(request: Request):
    result = await request.json()
    log_request(result)
    ok = api.delete_post(**result)
    return {
        "ok": ok,
    }


@router.post("/create_comment")
async def create_comment(request: Request):
    result = await request.json()
    log_request(result)
    ok = api.create_comment(**result)
    return {
        "ok": ok,
    }


@router.post("/update_comment")
async def update_comment(request: Request):
    result = await request.json()
    log_request(result)
    ok = api.update_comment(**result)
    return {
        "ok": ok,
    }
