from fastapi.testclient import TestClient


def _auth_headers(client: TestClient, email: str) -> dict[str, str]:
    token = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123"},
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _catalog(client: TestClient, admin_headers: dict[str, str]) -> tuple[int, int]:
    category = client.post(
        "/api/v1/categories",
        json={"name": "Intake Systems"},
        headers=admin_headers,
    ).json()
    brand = client.post(
        "/api/v1/brands",
        json={"name": "AEM"},
        headers=admin_headers,
    ).json()
    return category["id"], brand["id"]


def _product(
    client: TestClient,
    admin_headers: dict[str, str],
    category_id: int,
    brand_id: int,
    stock_quantity: int = 5,
) -> dict[str, object]:
    return client.post(
        "/api/v1/products",
        json={
            "name": "AEM Cold Air Intake",
            "description": "Cold air intake kit",
            "price": "300.00",
            "discount_price": "250.00",
            "stock_quantity": stock_quantity,
            "sku": "AEM-INT-001",
            "category_id": category_id,
            "brand_id": brand_id,
        },
        headers=admin_headers,
    ).json()


def test_cart_requires_authentication(client: TestClient) -> None:
    response = client.get("/api/v1/cart/")
    assert response.status_code == 401


def test_add_existing_product_increases_quantity_and_calculates_totals(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    headers = _auth_headers(client, "cart@example.com")
    category_id, brand_id = _catalog(client, admin_headers)
    product = _product(client, admin_headers, category_id, brand_id)

    first = client.post(
        "/api/v1/cart/add",
        json={"product_id": product["id"], "quantity": 2},
        headers=headers,
    )
    assert first.status_code == 200
    assert first.json()["total_items"] == 2
    assert first.json()["subtotal"] == "500.00"

    second = client.post(
        "/api/v1/cart/add",
        json={"product_id": product["id"], "quantity": 3},
        headers=headers,
    )
    assert second.status_code == 200
    body = second.json()
    assert len(body["items"]) == 1
    assert body["items"][0]["quantity"] == 5
    assert body["items"][0]["line_subtotal"] == "1250.00"
    assert body["total_items"] == 5
    assert body["subtotal"] == "1250.00"

    over_stock = client.post(
        "/api/v1/cart/add",
        json={"product_id": product["id"], "quantity": 1},
        headers=headers,
    )
    assert over_stock.status_code == 409


def test_update_remove_and_user_cart_isolation(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    first_user_headers = _auth_headers(client, "first-cart@example.com")
    second_user_headers = _auth_headers(client, "second-cart@example.com")
    category_id, brand_id = _catalog(client, admin_headers)
    product = _product(client, admin_headers, category_id, brand_id, stock_quantity=4)

    cart = client.post(
        "/api/v1/cart/add",
        json={"product_id": product["id"], "quantity": 2},
        headers=first_user_headers,
    ).json()
    item_id = cart["items"][0]["id"]

    missing_for_other_user = client.put(
        f"/api/v1/cart/{item_id}",
        json={"quantity": 1},
        headers=second_user_headers,
    )
    assert missing_for_other_user.status_code == 404

    too_many = client.put(
        f"/api/v1/cart/{item_id}",
        json={"quantity": 5},
        headers=first_user_headers,
    )
    assert too_many.status_code == 409

    updated = client.put(
        f"/api/v1/cart/{item_id}",
        json={"quantity": 1},
        headers=first_user_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["total_items"] == 1
    assert updated.json()["subtotal"] == "250.00"

    current_cart = client.get("/api/v1/cart/", headers=first_user_headers)
    assert current_cart.status_code == 200
    assert current_cart.json()["total_items"] == 1

    removed = client.delete(f"/api/v1/cart/{item_id}", headers=first_user_headers)
    assert removed.status_code == 200
    assert removed.json() == {"items": [], "subtotal": "0.00", "total_items": 0}
