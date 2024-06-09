import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry.propagate import inject

from feedback.tools import get_logger
from feedback.routers import api_v1
from feedback.observability import PrometheusMiddleware, metrics, setting_otlp


LOGGER = get_logger(__name__)
APP_NAME = "feedback"
OTLP_GRPC_ENDPOINT = os.environ.get("OTLP_GRPC_ENDPOINT", "http://tempo:4317")


app = FastAPI()
# app.add_middleware(PrometheusMiddleware, app_name=APP_NAME)
app.add_route("/metrics", metrics)

# Setting OpenTelemetry exporter
setting_otlp(app, APP_NAME, OTLP_GRPC_ENDPOINT)

app.include_router(api_v1.router, prefix="/api/v1")
app.include_router(api_v1.router, prefix="/api/latest")
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(
        f"{__name__}:app",
        host="0.0.0.0",
        port=8080,
        log_level="info",
        reload=True,
    )
