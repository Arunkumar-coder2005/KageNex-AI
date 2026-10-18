from pathlib import Path
from dotenv import load_dotenv

from fastapi import Depends, FastAPI

from app.auth import get_current_user
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
app = FastAPI(title="Cognitive Workspace API")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/me")
def me(user: dict = Depends(get_current_user)):
    return user
