import os
from functools import lru_cache

import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from jwt.exceptions import PyJWTError

load_dotenv()

app = FastAPI(title="KageNex AI")

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is missing from the .env file")

JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
JWT_ISSUER = f"{SUPABASE_URL}/auth/v1"
JWT_AUDIENCE = "authenticated"

security = HTTPBearer(auto_error=False)
jwks_client = PyJWKClient(JWKS_URL)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience=JWT_AUDIENCE,
            issuer=JWT_ISSUER,
            options={
                "require": ["exp", "sub", "aud", "iss"],
                "verify_signature": True,
                "verify_exp": True,
                "verify_aud": True,
                "verify_iss": True,
            },
        )

        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Token does not contain a user ID",
            )

        return {"id": user_id, "email": email}

    except PyJWTError as e:
        print("JWT validation error:", str(e))
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Unable to validate authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/me")
def get_me(current_user: dict = Depends(get_current_user)) -> dict:
    return current_user