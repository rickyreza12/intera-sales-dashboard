from fastapi.testclient import TestClient
from main import app


client = TestClient(app)

def get_token():
    response = client.post("/api/token", data={"username": "admin", "password": "password123"})
    return response.json()["access_token"]

def test_sales_reps_requires_token():
    response = client.post("/api/sales-reps")
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Missing or invalid token"
    
def test_sales_reps_success():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/sales-reps", headers=headers)
    assert response.status_code == 200
    assert "data" in response.json()
    assert isinstance(response.json()["data"], list)

def test_sales_reps_filter_by_region():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    params = {"region": "Europ"}
    
    response =client.post("/api/sales-reps", headers=headers, params=params)
    data = response.json()["data"]
    
    assert response.status_code == 200
    assert all(rep["region"] == "Europe" for rep in data)

def test_sales_reps_filter_by_skill():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    params = {"skill": "Negotiation"}
    
    response = client.post("/api/sales-reps", headers=headers, params=params)
    data = response.json()["data"]
    
    assert response.status_code == 200
    assert all("Negotiation" in rep["skills"] for rep in data)
    
def test_sales_reps_sort_by_deal_total():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    params = {"sort_by": "deal_total", "sort_order": "desc"}
    
    response = client.post("/api/sales-reps", headers=headers, params=params)
    data = response.json()["data"]
    
    assert response.status_code == 200
    values = [rep["deal_total"] for rep in data]
    assert values == sorted(values, reverse=True)
    
def test_sales_reps_pagination():
    token = get_token()
    headers = {"Authorization" : f"Bearer {token}"}
    params = {"page": 1, "size": 2}
    
    response = client.post("/api/sales-reps", headers=headers, params=params)
    data = response.json()
    
    assert response.status_code == 200
    assert len(data["data"]) <= 2
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["size"] == 2

def test_sales_reps_filter_empty_result():
    token = get_token()
    headers = {"Authorization" : f"Bearer {token}"}
    params = {"region": "Moon"}
    
    response = client.post("/api/sales-reps", headers=headers, params=params)
    data = response.json()
    
    assert response.status_code == 200
    assert data["data"] == []
    assert data["pagination"]["total"] == 0
    
def test_sales_reps_invalid_sort_field():
    token = get_token()
    header = {"Authorization": f"Bearer {token}"}
    params = {"sort_by": "nonexistent_field", "sort_order": "asc"}
    
    response = client.post("/api/sales-reps", headers=header, params=params)
    data = response.json()
    
    assert response.status_code == 200
    assert "data" in data