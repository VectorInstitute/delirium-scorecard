import pandas as pd
import numpy as np


def generate_test_data():
    data = {
        "attribute": ["Age", "Gender", "BMI", "Blood Pressure"],
        "year": [2023, 2023, 2023, 2023],
        "quarter": ["Q2", "Q2", "Q2", "Q2"],
        "recent_value": [65.0, 52.3, 27.5, 120.5],
        "recent_units": ["years", "", "kg/m²", "mmHg"],
        "recent_sd": [10.0, np.nan, 4.2, 15.3],
        "training_value": [63.0, 51.0, 26.8, 118.7],
        "training_units": ["years", "", "kg/m²", "mmHg"],
        "training_sd": [9.5, np.nan, 3.9, 14.8],
        "smd_value": [0.2, 0.3, 0.17, 0.12],
        "smd_units": ["", "", "", ""],
        "smd_sd": [np.nan, np.nan, np.nan, np.nan],
    }
    df = pd.DataFrame(data)
    df.to_csv("demographics.csv", index=False)
    print("Test data generated in demographics.csv")


generate_test_data()
