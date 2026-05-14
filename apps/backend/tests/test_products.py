from fastapi.testclient import TestClient


def _catalog(client: TestClient, admin_headers: dict[str, str]) -> tuple[int, int]:
    category = client.post(
        "/api/v1/categories",
        json={"name": "Exhaust Systems"},
        headers=admin_headers,
    ).json()
    brand = client.post(
        "/api/v1/brands",
        json={"name": "HKS"},
        headers=admin_headers,
    ).json()
    return category["id"], brand["id"]


def _product_payload(category_id: int, brand_id: int) -> dict[str, object]:
    return {
        "name": "HKS Hi-Power Exhaust",
        "description": "Stainless cat-back exhaust system",
        "price": "799.99",
        "discount_price": "699.99",
        "stock_quantity": 5,
        "sku": "HKS-EXH-001",
        "category_id": category_id,
        "brand_id": brand_id,
    }


def test_products_crud_filters_and_admin_permissions(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    category_id, brand_id = _catalog(client, admin_headers)

    customer = client.post(
        "/api/v1/auth/register",
        json={"email": "buyer@example.com", "password": "strongpass123"},
    ).json()
    customer_headers = {"Authorization": f"Bearer {customer['access_token']}"}

    forbidden = client.post(
        "/api/v1/products",
        json=_product_payload(category_id, brand_id),
        headers=customer_headers,
    )
    assert forbidden.status_code == 403

    created = client.post(
        "/api/v1/products",
        json=_product_payload(category_id, brand_id),
        headers=admin_headers,
    )
    assert created.status_code == 201
    body = created.json()
    product_id = body["id"]
    assert body["slug"] == "hks-hi-power-exhaust"
    assert body["stock_quantity"] == 5

    invalid_stock = client.post(
        "/api/v1/products",
        json={**_product_payload(category_id, brand_id), "stock_quantity": -1},
        headers=admin_headers,
    )
    assert invalid_stock.status_code == 422

    duplicate_sku = client.post(
        "/api/v1/products",
        json={**_product_payload(category_id, brand_id), "name": "Another Exhaust"},
        headers=admin_headers,
    )
    assert duplicate_sku.status_code == 409

    listed = client.get(
        f"/api/v1/products?search=hi-power&category_id={category_id}"
        f"&brand_id={brand_id}&min_price=700&max_price=900"
    )
    assert listed.status_code == 200
    assert listed.json()["meta"]["total"] == 1
    assert listed.json()["items"][0]["id"] == product_id

    by_slug = client.get("/api/v1/products/slug/hks-hi-power-exhaust")
    assert by_slug.status_code == 200
    assert by_slug.json()["sku"] == "HKS-EXH-001"

    updated = client.put(
        f"/api/v1/products/{product_id}",
        json={"name": "HKS Super Turbo Exhaust", "stock_quantity": 3},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["slug"] == "hks-super-turbo-exhaust"
    assert updated.json()["stock_quantity"] == 3

    deleted = client.delete(f"/api/v1/products/{product_id}", headers=admin_headers)
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/products/{product_id}").status_code == 404


def test_product_image_upload_and_static_file(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    category_id, brand_id = _catalog(client, admin_headers)
    product = client.post(
        "/api/v1/products",
        json=_product_payload(category_id, brand_id),
        headers=admin_headers,
    ).json()

    uploaded = client.post(
        f"/api/v1/products/{product['id']}/images?main_index=1",
        files=[
            ("files", ("front.png", b"fake image 1", "image/png")),
            ("files", ("rear.jpg", b"fake image 2", "image/jpeg")),
        ],
        headers=admin_headers,
    )
    assert uploaded.status_code == 200
    images = uploaded.json()["images"]
    assert len(images) == 2
    assert images[0]["is_main"] is False
    assert images[1]["is_main"] is True

    static_response = client.get(images[0]["image_url"])
    assert static_response.status_code == 200
    assert static_response.content == b"fake image 1"

    promoted = client.put(
        f"/api/v1/products/{product['id']}/images/{images[0]['id']}/main",
        headers=admin_headers,
    )
    assert promoted.status_code == 200
    assert promoted.json()["is_main"] is True

    deleted = client.delete(
        f"/api/v1/products/{product['id']}/images/{images[1]['id']}",
        headers=admin_headers,
    )
    assert deleted.status_code == 204
