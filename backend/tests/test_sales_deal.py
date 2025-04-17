from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def get_token():
    response = client.post("/api/token", data={"username": "admin", "password": "password123"})
    return response.json()["access_token"]

def test_deal_status_requires_token():
    response = client.post("/api/sales/deal-status")
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Missing or invalid token"

def test_deal_status_success():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/sales/deal-status", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "summary" in data
    assert isinstance(data["summary"], list)
    assert "total_deals" in data
    assert "total_value" in data
    assert isinstance(data["total_deals"], int)
    assert isinstance(data["total_value"], int)

def test_deal_status_contains_expected_statuses():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/sales/deal-status", headers=headers)
    summary = [item["status"] for item in response.json()["data"]["summary"]]
    assert "Closed Won" in summary
    assert "Closed Lost" in summary
    assert "In Progress" in summary