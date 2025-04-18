from datetime import datetime, timedelta
import re
from jose import jwt
from tests import API_PREFIX, client
from config.settings import settings
from main import app


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

def test_login_success():
    response = client.post("/api/token", data={"username": "admin", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    
def test_login_failure():
    response = client.post("/api/token", data = {"username": "admin", "password": "wrong"})
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Invalid Credentials"

def test_login_missing_fields():
    response = client.post("/api/token", data={})
    assert response.status_code == 422
    assert response.json()["detail"][0]["msg"] == "Field required"

def test_token_structure():
    response = client.post("/api/token", data={"username":"admin", "password":"password123"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    assert re.match(r"^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$", token)

def test_protected_endpoint_no_token():
    response = client.post(f"{API_PREFIX}/sales-reps")
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Missing or invalid token"

def test_protected_endpoint_valid_token():
    login = client.post("/api/token", data={"username":"admin", "password": "password123"})
    token = login.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(f"{API_PREFIX}/sales-reps", headers=headers)
    
    assert response.status_code == 200
    assert response.json()["data"] is not None
    assert isinstance(response.json()["data"], list)
    
def test_token_expired_logic():
    expire = datetime.utcnow() - timedelta(minutes=1)
    payload = {"sub": "admin", "exp": expire}
    expired_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.post(f"{API_PREFIX}/sales-reps", headers=headers)
    
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Invalid token"