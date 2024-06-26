import os

from db.core import DBSession
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.limiter import limiter
from routers.router import create_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI()  # FastAPI(lifespan=lifespan)

session_router = create_router(DBSession)
app.include_router(session_router)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/")
def read_root():
    return "Server is running."

origins = [
    "https://homegame.onrender.com"
] if os.environ.get('PYTHON_ENV') == 'production' else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
