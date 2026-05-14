from fastapi.testclient import TestClient


def test_register_login_and_me(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "Driver@example.com",
            "password": "strongpass123",
            "full_name": "Test Driver",
        },
    )

    assert register_response.status_code == 201
    register_body = register_response.json()
    assert register_body["token_type"] == "bearer"
    assert register_body["user"]["email"] == "driver@example.com"
    assert "access_token" in register_body

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "driver@example.com", "password": "strongpass123"},
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    me_response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert me_response.status_code == 200
    assert me_response.json()["email"] == "driver@example.com"


def test_duplicate_register_returns_conflict(client: TestClient) -> None:
    payload = {
        "email": "duplicate@example.com",
        "password": "strongpass123",
        "full_name": "Duplicate User",
    }

    assert client.post("/api/v1/auth/register", json=payload).status_code == 201
    assert client.post("/api/v1/auth/register", json=payload).status_code == 409


def test_login_rejects_wrong_password(client: TestClient) -> None:
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "wrong-password@example.com",
            "password": "strongpass123",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrong-password@example.com", "password": "badpass123"},
    )

    assert response.status_code == 401
