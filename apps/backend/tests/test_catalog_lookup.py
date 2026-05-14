from fastapi.testclient import TestClient


def test_categories_crud_requires_admin(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    customer = client.post(
        "/api/v1/auth/register",
        json={"email": "customer@example.com", "password": "strongpass123"},
    ).json()
    customer_headers = {
        "Authorization": f"Bearer {customer['access_token']}",
    }

    forbidden = client.post(
        "/api/v1/categories",
        json={"name": "Exhaust Systems"},
        headers=customer_headers,
    )
    assert forbidden.status_code == 403

    created = client.post(
        "/api/v1/categories",
        json={"name": "Exhaust Systems", "description": "Performance exhaust parts"},
        headers=admin_headers,
    )
    assert created.status_code == 201
    category_id = created.json()["id"]
    assert created.json()["slug"] == "exhaust-systems"

    listed = client.get("/api/v1/categories?limit=10&offset=0")
    assert listed.status_code == 200
    assert listed.json()["meta"]["total"] == 1
    assert len(listed.json()["items"]) == 1

    detail = client.get(f"/api/v1/categories/{category_id}")
    assert detail.status_code == 200
    assert detail.json()["name"] == "Exhaust Systems"

    updated = client.put(
        f"/api/v1/categories/{category_id}",
        json={"name": "Engine Tuning"},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["slug"] == "engine-tuning"

    deleted = client.delete(
        f"/api/v1/categories/{category_id}",
        headers=admin_headers,
    )
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/categories/{category_id}").status_code == 404


def test_brands_crud(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    created = client.post(
        "/api/v1/brands",
        json={"name": "HKS", "description": "Japanese tuning brand"},
        headers=admin_headers,
    )
    assert created.status_code == 201
    brand_id = created.json()["id"]
    assert created.json()["slug"] == "hks"

    duplicate = client.post(
        "/api/v1/brands",
        json={"name": "HKS"},
        headers=admin_headers,
    )
    assert duplicate.status_code == 409

    listed = client.get("/api/v1/brands?limit=5&offset=0")
    assert listed.status_code == 200
    assert listed.json()["meta"] == {"total": 1, "limit": 5, "offset": 0}

    updated = client.put(
        f"/api/v1/brands/{brand_id}",
        json={"description": "Updated brand"},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["description"] == "Updated brand"

    assert client.delete(f"/api/v1/brands/{brand_id}", headers=admin_headers).status_code == 204


def test_car_models_crud_and_brand_filter(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    brand = client.post(
        "/api/v1/brands",
        json={"name": "Toyota"},
        headers=admin_headers,
    ).json()

    created = client.post(
        "/api/v1/car-models",
        json={
            "brand_id": brand["id"],
            "name": "Supra",
            "year_start": 1993,
            "year_end": 2002,
        },
        headers=admin_headers,
    )
    assert created.status_code == 201
    car_model_id = created.json()["id"]
    assert created.json()["slug"] == "supra"

    missing_brand = client.post(
        "/api/v1/car-models",
        json={"brand_id": 999, "name": "Skyline"},
        headers=admin_headers,
    )
    assert missing_brand.status_code == 404

    invalid_years = client.post(
        "/api/v1/car-models",
        json={
            "brand_id": brand["id"],
            "name": "Celica",
            "year_start": 2005,
            "year_end": 2000,
        },
        headers=admin_headers,
    )
    assert invalid_years.status_code == 422

    listed = client.get(f"/api/v1/car-models?brand_id={brand['id']}&limit=10")
    assert listed.status_code == 200
    assert listed.json()["meta"]["total"] == 1

    updated = client.put(
        f"/api/v1/car-models/{car_model_id}",
        json={"name": "GR Supra", "year_start": 2019, "year_end": None},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["slug"] == "gr-supra"

    assert client.delete(
        f"/api/v1/car-models/{car_model_id}",
        headers=admin_headers,
    ).status_code == 204
