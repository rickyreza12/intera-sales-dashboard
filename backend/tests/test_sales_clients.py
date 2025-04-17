from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def get_token():
    response = client.post("/api/token", data={"username": "admin", "password": "password123"})
    return response.json()["access_token"]

def test_client_overview_requires_token():
    response = client.post("/api/sales/clients")
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Missing or invalid token"

def test_client_overview_success():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/sales/clients", headers=headers)
    
    assert response.status_code == 200
    data = response.json()["data"]
    assert isinstance(data, list)
    assert "name" in data[0]
    assert "industry" in data[0]
    assert "contact" in data[0]
    assert "appearances" in data[0]
    assert data[0]["appearances"] >= 1

def test_client_overview_unique_clients():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    reponse = client.post("/api/sales/clients", headers=headers)
    
    assert reponse.status_code == 200
    clients = reponse.json()["data"]
    names = [client["name"] for client in clients] 
    assert len(names) == len(set(names))