"""Routes."""

import logging

from fastapi import APIRouter

from backend.api.delirium import (
    get_delirium_rates,
    get_patient_demographics,
    get_time_trends,
)


router = APIRouter()
LOGGER = logging.getLogger("uvicorn.error")


router.add_api_route("/rates", get_delirium_rates, methods=["GET"])
router.add_api_route("/time-trends", get_time_trends, methods=["GET"])
router.add_api_route("/demographics", get_patient_demographics, methods=["GET"])
