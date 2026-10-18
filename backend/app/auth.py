import os
from functools import lru_cache

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache
def get_jwks_client():
    supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    if not supabase_url:
        raise RuntimeError("SUPABASE_URL is not configured")

    return PyJWKClient(f"{supabase_url}/auth/v1/.well-known/jwks.json")


def verify_token(token: str) -> dict:
    try:
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")

        if algorithm in ("ES256", "RS256"):
            signing_key = get_jwks_client().get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                audience="authenticated",
                issuer=f"{os.environ['SUPABASE_URL'].rstrip('/')}/auth/v1",
            )
            return payload

        if algorithm == "HS256":
            secret = os.getenv("SUPABASE_JWT_SECRET")
            if not secret:
                raise HTTPException(
                    status_code=401, detail="Invalid authentication token"
                )

            return jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=f"{os.environ['SUPABASE_URL'].rstrip('/')}/auth/v1",
            )

        raise HTTPException(
            status_code=401, detail="Unsupported token algorithm"
        )

    except HTTPException:
        raise
    except Exception as error:
        print("JWT verification error:", type(error).__name__, str(error))
    raise HTTPException(
        status_code=401,
        detail="Invalid authentication token"
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_token(credentials.credentials)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token has no user ID")

    return {
        "id": user_id,
        "email": payload.get("email"),
    }
