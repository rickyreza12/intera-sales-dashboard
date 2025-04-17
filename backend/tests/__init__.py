from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
API_PREFIX = "/api/sales"

def get_token():
    response = client.post("/api/token", data={"username": "admin", "password": "password123"})
    return response.json()["access_token"]