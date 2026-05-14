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
        json={"name": "Suspension"},
        headers=admin_headers,
    ).json()
    brand = client.post(
        "/api/v1/brands",
        json={"name": "KW"},
        headers=admin_headers,
    ).json()
    return category["id"], brand["id"]


def _product(
    client: TestClient,
    admin_headers: dict[str, str],
    category_id: int,
    brand_id: int,
    stock_quantity: int,
    sku: str = "KW-COIL-001",
) -> dict[str, object]:
    return client.post(
        "/api/v1/products",
        json={
            "name": f"KW Coilover Kit {sku}",
            "description": "Adjustable coilover suspension kit",
            "price": "1200.00",
            "discount_price": "1000.00",
            "stock_quantity": stock_quantity,
            "sku": sku,
            "category_id": category_id,
            "brand_id": brand_id,
        },
        headers=admin_headers,
    ).json()


def _order_payload() -> dict[str, str]:
    return {
        "customer_name": "Ali Valiyev",
        "phone_number": "+998901234567",
        "address": "Tashkent, Amir Temur street 1",
    }


def test_checkout_moves_cart_to_order_decreases_stock_and_clears_cart(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    user_headers = _auth_headers(client, "checkout@example.com")
    category_id, brand_id = _catalog(client, admin_headers)
    product = _product(client, admin_headers, category_id, brand_id, stock_quantity=5)

    cart = client.post(
        "/api/v1/cart/add",
        json={"product_id": product["id"], "quantity": 2},
        headers=user_headers,
    )
    assert cart.status_code == 200

    created = client.post(
        "/api/v1/orders",
        json=_order_payload(),
        headers=user_headers,
    )
    assert created.status_code == 201
    order = created.json()
    assert order["status"] == "PENDING"
    assert order["total_price"] == "2000.00"
    assert len(order["items"]) == 1
    assert order["items"][0]["quantity"] == 2
    assert order["items"][0]["price"] == "1000.00"
    assert order["items"][0]["subtotal"] == "2000.00"

    product_after_checkout = client.get(f"/api/v1/products/{product['id']}")
    assert product_after_checkout.status_code == 200
    assert product_after_checkout.json()["stock_quantity"] == 3

    cart_after_checkout = client.get("/api/v1/cart/", headers=user_headers)
    assert cart_after_checkout.status_code == 200
    assert cart_after_checkout.json() == {
        "items": [],
        "subtotal": "0.00",
        "total_items": 0,
    }

    history = client.get("/api/v1/orders", headers=user_headers)
    assert history.status_code == 200
    assert history.json()["meta"]["total"] == 1

    detail = client.get(f"/api/v1/orders/{order['id']}", headers=user_headers)
    assert detail.status_code == 200
    assert detail.json()["id"] == order["id"]


def test_checkout_fails_when_stock_becomes_insufficient(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    user_headers = _auth_headers(client, "stock-checkout@example.com")
    category_id, brand_id = _catalog(client, admin_headers)
    product = _product(client, admin_headers, category_id, brand_id, stock_quantity=2)

    client.post(
        "/api/v1/cart/add",
        json={"product_id": product["id"], "quantity": 2},
        headers=user_headers,
    )
    client.put(
        f"/api/v1/products/{product['id']}",
        json={"stock_quantity": 1},
        headers=admin_headers,
    )

    checkout = client.post(
        "/api/v1/orders",
        json=_order_payload(),
        headers=user_headers,
    )
    assert checkout.status_code == 409

    product_after_failed_checkout = client.get(f"/api/v1/products/{product['id']}")
    assert product_after_failed_checkout.json()["stock_quantity"] == 1
    assert client.get("/api/v1/cart/", headers=user_headers).json()["total_items"] == 2


def test_admin_can_update_order_status_and_customer_cannot(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    user_headers = _auth_headers(client, "status@example.com")
    category_id, brand_id = _catalog(client, admin_headers)
    product = _product(
        client,
        admin_headers,
        category_id,
        brand_id,
        stock_quantity=3,
        sku="KW-COIL-STATUS",
    )
    client.post(
        "/api/v1/cart/add",
        json={"product_id": product["id"], "quantity": 1},
        headers=user_headers,
    )
    order = client.post(
        "/api/v1/orders",
        json=_order_payload(),
        headers=user_headers,
    ).json()

    forbidden = client.put(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "CONFIRMED"},
        headers=user_headers,
    )
    assert forbidden.status_code == 403

    updated = client.put(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "CONFIRMED"},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["status"] == "CONFIRMED"

    invalid_status = client.put(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "UNKNOWN"},
        headers=admin_headers,
    )
    assert invalid_status.status_code == 422
