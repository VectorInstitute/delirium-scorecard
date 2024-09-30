"""Backend server for the app."""

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.auth import router as auth_router
from api.routes.delirium import router as delirium_router
from api.users.crud import create_initial_admin
from api.users.db import get_async_session, init_db


logger = logging.getLogger("uvicorn")


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


@app.on_event("startup")
async def startup_event() -> None:
    """
    Initialize the database and create the initial admin user on startup.

    This function is called when the FastAPI application starts up. It initializes
    the database and creates an initial admin user if one doesn't already exist.
    """
    try:
        await init_db()
        async for session in get_async_session():
            await create_initial_admin(session)
    except Exception as e:
        logger.error(f"Startup failed: {str(e)}")
        raise
