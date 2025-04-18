
from tests import API_PREFIX, client, get_token
from main import app

def test_summary_requires_token():
    response = client.post(f"{API_PREFIX}/summary")
    assert response.status_code == 401
    assert response.json()["detail"]["message"] == "Missing or invalid token"
    
def test_summary_success():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(f"{API_PREFIX}/summary", headers=headers)
    data = response.json()
    
    assert response.status_code == 200
    assert "data" in data
    assert "total_revenue" in data["data"]
    assert "in_progress_revenue" in data["data"]
    assert "revenue_by_region" in data["data"]
    
def test_summary_revenue_totals():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(f"{API_PREFIX}/summary", headers=headers)
    data = response.json()["data"]

    assert data["total_revenue"] == 445000 
    assert data["in_progress_revenue"] == 400000

def test_summary_group_by_region():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(f"{API_PREFIX}/summary", headers=headers)
    regions = [item["region"] for item in response.json()["data"]["revenue_by_region"]]

    assert "Europe" in regions
    assert "North America" in regions
    assert len(regions) == 5 