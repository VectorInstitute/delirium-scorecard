"""Data module."""

import io
import math
from enum import Enum
from typing import Dict, List, Optional

import pandas as pd
from minio import Minio
from pydantic import BaseModel, validator


minio_client = Minio(
    "minio:9000", access_key="minioadmin", secret_key="minioadmin", secure=False
)


class Quarter(str, Enum):
    """Quarter of the year."""

    Q1 = "Q1"
    Q2 = "Q2"
    Q3 = "Q3"
    Q4 = "Q4"


class DeliriumRate(BaseModel):
    """Delirium rate for a given quarter and ward."""

    quarter: Quarter
    year: int
    rate: float
    ward: str


class TimeSeriesData(BaseModel):
    """Time series data for a given period."""

    period: str
    gim: float
    other_wards: float


class DemographicValue(BaseModel):
    """Demographic value for a given attribute."""

    value: float
    units: str
    standard_deviation: Optional[float] = None

    @validator("value", "standard_deviation", pre=True)
    def check_nan(cls, v):  # noqa: N805
        """Check for NaN values."""
        if v is None or (isinstance(v, float) and math.isnan(v)):
            return None
        return v

    @validator("units", pre=True)
    def check_nan_units(cls, v):  # noqa: N805
        """Check for NaN values."""
        if v is None or (isinstance(v, float) and math.isnan(v)):
            return ""
        return v


class DemographicItem(BaseModel):
    """Demographic item for a given attribute."""

    recent: DemographicValue
    training: DemographicValue
    standard_mean_difference: DemographicValue


class PatientDemographics(BaseModel):
    """Patient demographics for a given quarter and ward."""

    data: Dict[str, DemographicItem]
    recent_quarter: str
    recent_year: int


def load_data_from_minio(bucket_name: str, object_name: str) -> pd.DataFrame:
    """Load data from MinIO."""
    try:
        data = minio_client.get_object(bucket_name, object_name)
        return pd.read_csv(io.BytesIO(data.read()))
    except Exception as e:
        print(f"Error loading data from MinIO: {e}")
        return pd.DataFrame()


def get_most_recent_quarter(df: pd.DataFrame) -> tuple[int, Quarter]:
    """Get the most recent quarter from a DataFrame."""
    df["year"] = df["year"].astype(int)
    df["quarter"] = pd.Categorical(
        df["quarter"], categories=["Q1", "Q2", "Q3", "Q4"], ordered=True
    )
    most_recent = df.sort_values(["year", "quarter"], ascending=[False, False]).iloc[0]
    return most_recent["year"], most_recent["quarter"]


def get_delirium_rates() -> List[DeliriumRate]:
    """Get delirium rates for a given quarter and ward."""
    df = load_data_from_minio("delirium-data", "delirium_rates.csv")
    return [
        DeliriumRate(
            quarter=row["quarter"], year=row["year"], rate=row["rate"], ward=row["ward"]
        )
        for _, row in df.iterrows()
    ]


def get_time_trends() -> List[TimeSeriesData]:
    """Get time trends for a given period."""
    df = load_data_from_minio("delirium-data", "time_trends.csv")
    return [
        TimeSeriesData(
            period=row["period"], gim=row["gim"], other_wards=row["other_wards"]
        )
        for _, row in df.iterrows()
    ]


def get_patient_demographics() -> PatientDemographics:
    """Get patient demographics for a given quarter and ward."""
    df = load_data_from_minio("delirium-data", "demographics.csv")
    recent_year, recent_quarter = get_most_recent_quarter(df)

    data = {}
    for _, row in df.iterrows():
        if row["year"] == recent_year and row["quarter"] == recent_quarter:
            data[row["attribute"]] = DemographicItem(
                recent=DemographicValue(
                    value=row["recent_value"],
                    units=row["recent_units"],
                    standard_deviation=row["recent_sd"],
                ),
                training=DemographicValue(
                    value=row["training_value"],
                    units=row["training_units"],
                    standard_deviation=row["training_sd"],
                ),
                standard_mean_difference=DemographicValue(
                    value=row["smd_value"],
                    units=row["smd_units"],
                    standard_deviation=row["smd_sd"],
                ),
            )

    return PatientDemographics(
        data=data, recent_quarter=recent_quarter, recent_year=recent_year
    )
