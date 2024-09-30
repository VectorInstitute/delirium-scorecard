from minio import Minio

minio_client = Minio(
    "localhost:9000", access_key="minioadmin", secret_key="minioadmin", secure=False
)

bucket_name = "delirium-data"

# Create bucket if it doesn't exist
if not minio_client.bucket_exists(bucket_name):
    minio_client.make_bucket(bucket_name)

# Upload files
files = ["delirium_rates.csv", "time_trends.csv", "demographics.csv"]

for file in files:
    minio_client.fput_object(bucket_name, file, file)
    print(f"'{file}' is successfully uploaded to bucket '{bucket_name}'.")
