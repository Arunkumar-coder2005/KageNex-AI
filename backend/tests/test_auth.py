from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_me_rejects_missing_token():
    response = client.get("/me")
    assert response.status_code == 401


def test_me_rejects_malformed_token():
    response = client.get(
        "/me",
        headers={"Authorization": "Bearer not-a-valid-jwt"},
    )
    assert response.status_code == 401


def test_me_accepts_valid_token(monkeypatch):
    import time
    import jwt

    supabase_url = "https://example.supabase.co"
    secret = "test-only-secret-for-unit-tests-longer-than-32-bytes-longer-than-32-bytes"

    monkeypatch.setenv("SUPABASE_URL", supabase_url)
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)

    payload = {
        "sub": "test-user-id",
        "email": "test@example.com",
        "aud": "authenticated",
        "iss": f"{supabase_url}/auth/v1",
        "exp": int(time.time()) + 300,
    }

    token = jwt.encode(payload, secret, algorithm="HS256")
    response = client.get(
        "/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": "test-user-id",
        "email": "test@example.com",
    }
