from fastapi.testclient import TestClient
from main import app
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

client = TestClient(app)
API_PREFIX = "/api/sales"
API_AI_URL = "/api/ai/mocked"

def get_token():
    response = client.post("/api/token", data={"username": "admin", "password": "password123"})
    return response.json()["access_token"]