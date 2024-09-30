"""Delirium scorecard routes."""

from typing import List

from fastapi import APIRouter

from api.data import (
    DeliriumRate,
    PatientDemographics,
    TimeSeriesData,
    get_delirium_rates,
    get_patient_demographics,
    get_time_trends,
)


router = APIRouter()


@router.get("/rates", response_model=List[DeliriumRate])
async def delirium_rates() -> List[DeliriumRate]:
    """Get delirium rates.

    Returns
    -------
    List[DeliriumRate]
    """
    return get_delirium_rates()


@router.get("/time-trends", response_model=List[TimeSeriesData])
async def time_trends() -> List[TimeSeriesData]:
    """Get time trends.

    Returns
    -------
    List[TimeSeriesData]
    """
    return get_time_trends()


@router.get("/demographics", response_model=PatientDemographics)
async def patient_demographics() -> PatientDemographics:
    """Get patient demographics.

    Returns
    -------
    PatientDemographics
    """
    return get_patient_demographics()
