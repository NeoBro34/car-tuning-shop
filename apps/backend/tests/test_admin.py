from fastapi.testclient import TestClient


def _user_headers(client: TestClient, email: str) -> dict[str, str]:
    token = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "strongpass123"},
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _catalog(client: TestClient, admin_headers: dict[str, str]) -> tuple[int, int]:
    category = client.post(
        "/api/v1/categories",
        json={"name": "Admin Engine Parts"},
        headers=admin_headers,
    ).json()
    brand = client.post(
        "/api/v1/brands",
        json={"name": "Admin HKS"},
        headers=admin_headers,
    ).json()
    return category["id"], brand["id"]


def _product(
    client: TestClient,
    admin_headers: dict[str, str],
    category_id: int,
    brand_id: int,
) -> dict[str, object]:
    return client.post(
        "/api/v1/products",
        json={
            "name": "Admin Turbo Kit",
            "description": "Turbo kit for dashboard tests",
            "price": "1500.00",
            "discount_price": "1200.00",
            "stock_quantity": 4,
            "sku": "ADM-TURBO-001",
            "category_id": category_id,
            "brand_id": brand_id,
        },
        headers=admin_headers,
    ).json()


def _create_order(
    client: TestClient,
    user_headers: dict[str, str],
    product_id: int,
) -> dict[str, object]:
    client.post(
        "/api/v1/cart/add",
        json={"product_id": product_id, "quantity": 1},
        headers=user_headers,
    )
    return client.post(
        "/api/v1/orders",
        json={
            "customer_name": "Admin Test User",
            "phone_number": "+998901111111",
            "address": "Tashkent admin test address",
        },
        headers=user_headers,
    ).json()


def test_admin_routes_require_admin(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    user_headers = _user_headers(client, "plain-user@example.com")

    forbidden = client.get("/api/v1/admin/dashboard", headers=user_headers)
    assert forbidden.status_code == 403

    dashboard = client.get("/api/v1/admin/dashboard", headers=admin_headers)
    assert dashboard.status_code == 200
    assert dashboard.json()["total_users"] == 2


def test_admin_dashboard_users_products_and_orders(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    user_headers = _user_headers(client, "admin-customer@example.com")
    category_id, brand_id = _catalog(client, admin_headers)
    product = _product(client, admin_headers, category_id, brand_id)
    order = _create_order(client, user_headers, int(product["id"]))

    dashboard = client.get("/api/v1/admin/dashboard", headers=admin_headers)
    assert dashboard.status_code == 200
    body = dashboard.json()
    assert body["total_users"] == 2
    assert body["total_products"] == 1
    assert body["total_orders"] == 1
    assert body["total_revenue"] == "1200.00"

    users = client.get("/api/v1/admin/users", headers=admin_headers)
    assert users.status_code == 200
    assert users.json()["meta"]["total"] == 2

    orders = client.get("/api/v1/admin/orders", headers=admin_headers)
    assert orders.status_code == 200
    assert orders.json()["items"][0]["id"] == order["id"]


def test_admin_can_manage_stock_active_users_and_order_status(
    client: TestClient,
    admin_headers: dict[str, str],
) -> None:
    user_headers = _user_headers(client, "managed-user@example.com")
    category_id, brand_id = _catalog(client, admin_headers)
    product = _product(client, admin_headers, category_id, brand_id)
    order = _create_order(client, user_headers, int(product["id"]))

    stock = client.put(
        f"/api/v1/admin/products/{product['id']}/stock",
        json={"stock_quantity": 9},
        headers=admin_headers,
    )
    assert stock.status_code == 200
    assert stock.json()["stock_quantity"] == 9

    inactive = client.put(
        f"/api/v1/admin/products/{product['id']}/active",
        json={"is_active": False},
        headers=admin_headers,
    )
    assert inactive.status_code == 200
    assert inactive.json()["is_active"] is False

    confirmed = client.put(
        f"/api/v1/admin/orders/{order['id']}/status",
        json={"status": "CONFIRMED"},
        headers=admin_headers,
    )
    assert confirmed.status_code == 200
    assert confirmed.json()["status"] == "CONFIRMED"

    users = client.get("/api/v1/admin/users", headers=admin_headers).json()["items"]
    managed_user = next(user for user in users if user["email"] == "managed-user@example.com")

    blocked = client.put(
        f"/api/v1/admin/users/{managed_user['id']}/block",
        headers=admin_headers,
    )
    assert blocked.status_code == 200
    assert blocked.json()["is_active"] is False

    login_blocked = client.post(
        "/api/v1/auth/login",
        json={"email": "managed-user@example.com", "password": "strongpass123"},
    )
    assert login_blocked.status_code == 403

    unblocked = client.put(
        f"/api/v1/admin/users/{managed_user['id']}/unblock",
        headers=admin_headers,
    )
    assert unblocked.status_code == 200
    assert unblocked.json()["is_active"] is True
