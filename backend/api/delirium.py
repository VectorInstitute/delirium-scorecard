"""Delirium rates API endpoints."""

from typing import Dict, List

from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()


class DeliriumRate(BaseModel):
    """
    Represents the delirium rate for a specific quarter.

    Attributes
    ----------
    quarter : str
        The quarter identifier (e.g., 'Q1', 'Q2', etc.).
    rate : int
        The delirium rate as a percentage.
    """

    quarter: str
    rate: int


class TimeSeriesData(BaseModel):
    """
    Represents time series data for delirium rates across different wards.

    Attributes
    ----------
    period : str
        The time period (e.g., 'Q1 2022', 'Q2 2022', etc.).
    gim : float
        The delirium rate for the General Internal Medicine ward.
    other_wards : float
        The delirium rate for other wards combined.
    """

    period: str
    gim: float
    other_wards: float


class DemographicItem(BaseModel):
    """
    Represents demographic data for a specific attribute.

    Attributes
    ----------
    q4_2022 : str
        The value for Q4 2022.
    training : str
        The value for the training period.
    standard_mean_difference : str
        The standard mean difference between Q4 2022 and training.
    """

    q4_2022: str
    training: str
    standard_mean_difference: str


class PatientDemographics(BaseModel):
    """
    Represents a collection of patient demographic data.

    Attributes
    ----------
    data : Dict[str, DemographicItem]
        A dictionary of demographic attributes and their corresponding values.
    """

    data: Dict[str, DemographicItem]


@app.get("/rates", response_model=List[DeliriumRate])
async def get_delirium_rates() -> List[DeliriumRate]:
    """
    Retrieve delirium rates for the last three quarters.

    Returns
    -------
    List[DeliriumRate]
        A list of DeliriumRate objects containing quarter and rate information.
    """
    return [
        DeliriumRate(quarter="Q2", rate=39),
        DeliriumRate(quarter="Q3", rate=34),
        DeliriumRate(quarter="Q4", rate=30),
    ]


@app.get("/time-trends", response_model=List[TimeSeriesData])
async def get_time_trends() -> List[TimeSeriesData]:
    """
    Retrieve time trends of delirium rates for GIM and other wards.

    Returns
    -------
    List[TimeSeriesData]
        A list of TimeSeriesData objects containing period and rate information.
    """
    return [
        TimeSeriesData(period="Q1 2022", gim=5, other_wards=12),
        TimeSeriesData(period="Q2 2022", gim=7, other_wards=10),
        TimeSeriesData(period="Q3 2022", gim=6, other_wards=11),
        TimeSeriesData(period="Q4 2022", gim=8, other_wards=9),
        TimeSeriesData(period="Q1 2023", gim=5, other_wards=13),
        TimeSeriesData(period="Q2 2023", gim=9, other_wards=15),
        TimeSeriesData(period="Q3 2023", gim=7, other_wards=18),
        TimeSeriesData(period="Q4 2023", gim=4, other_wards=19),
    ]


@app.get("/demographics", response_model=PatientDemographics)
async def get_patient_demographics() -> PatientDemographics:
    """
    Retrieve patient demographic information.

    Returns
    -------
    PatientDemographics
        A PatientDemographics object containing various demographic attributes.
    """
    return PatientDemographics(
        data={
            "Number of Unique Hospitalizations": DemographicItem(
                q4_2022="1,234", training="5,678", standard_mean_difference="0.02"
            ),
            "Age (mean, [SD])": DemographicItem(
                q4_2022="68.5 [15.2]",
                training="67.8 [14.9]",
                standard_mean_difference="0.05",
            ),
            "Female": DemographicItem(
                q4_2022="45%", training="47%", standard_mean_difference="0.04"
            ),
            "High Complexity of Admission": DemographicItem(
                q4_2022="22%", training="20%", standard_mean_difference="-0.05"
            ),
            "Admission via Residence": DemographicItem(
                q4_2022="78%", training="80%", standard_mean_difference="0.05"
            ),
            "Admission at Night": DemographicItem(
                q4_2022="35%", training="33%", standard_mean_difference="-0.04"
            ),
            "Admission by Season": DemographicItem(
                q4_2022="", training="", standard_mean_difference=""
            ),
            "Spring": DemographicItem(
                q4_2022="23%", training="24%", standard_mean_difference="0.02"
            ),
            "Summer": DemographicItem(
                q4_2022="26%", training="25%", standard_mean_difference="-0.02"
            ),
            "Fall": DemographicItem(
                q4_2022="25%", training="26%", standard_mean_difference="0.02"
            ),
            "Winter": DemographicItem(
                q4_2022="26%", training="25%", standard_mean_difference="-0.02"
            ),
            "Predicted Risk of Death": DemographicItem(
                q4_2022="0.061 [0.092]",
                training="0.058 [0.089]",
                standard_mean_difference="0.03",
            ),
            "Length of Hospital Stay": DemographicItem(
                q4_2022="7.8 [9.1]",
                training="7.5 [8.8]",
                standard_mean_difference="0.03",
            ),
            "Length of ICU Stay": DemographicItem(
                q4_2022="0.5 [2.1]",
                training="0.4 [1.9]",
                standard_mean_difference="0.05",
            ),
        }
    )
