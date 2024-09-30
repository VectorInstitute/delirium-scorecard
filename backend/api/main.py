"""Backend server for the app."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.auth import router as auth_router
from api.routes.delirium import router as delirium_router


app = FastAPI()
frontend_port = os.getenv("FRONTEND_PORT", None)
if not frontend_port:
    raise ValueError("No FRONTEND_PORT environment variable set!")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"http://localhost:{frontend_port}"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(delirium_router)
app.include_router(auth_router)
