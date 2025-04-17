from fastapi.testclient import TestClient
from tests import API_PREFIX, get_token, client
from main import app


def test_top_reps_requires_token():
    response = client.post(f"{API_PREFIX}/top-reps")
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Missing or invalid token"

def test_top_reps_success():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(f"{API_PREFIX}/top-reps", headers=headers)
    
    assert response.status_code == 200
    data = response.json()["data"]
    
    assert len(data) == 3
    assert all("name" in rep and "revenue" in rep for rep in data)

def test_top_reps_sorted_by_revenue():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(f"{API_PREFIX}/top-reps", headers=headers)
    reps = response.json()["data"]

    revenues = [rep["revenue"] for rep in reps]
    assert revenues == sorted(revenues, reverse=True)

def test_top_reps_limit_three():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(f"{API_PREFIX}/top-reps", headers=headers)
    data = response.json()["data"]
    assert len(data) == 3
