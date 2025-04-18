from tests import API_AI_URL, client, get_token

def test_ai_top_sales():
    token = get_token()
    response = client.post(API_AI_URL, headers={"Authorization": f"Bearer {token}"}, json={"question": "Who is the top sales rep?"})
    assert response.status_code == 200
    assert "Alice" in response.json()["answer"]

def test_ai_fuzzy_match():
    token = get_token()
    response = client.post(API_AI_URL, headers={"Authorization": f"Bearer {token}"}, json={"question": "most skillful rep?"})
    assert response.status_code == 200
    assert any(name in response.json()["answer"] for name in ["Charlie", "Alice"])

def test_ai_rep_summary():
    token = get_token()
    response = client.post(API_AI_URL, headers={"Authorization": f"Bearer {token}"}, json={"question": "Tell me about Dana"})
    assert response.status_code == 200
    assert "Dana" in response.json()["answer"]

def test_ai_fun_fact():
    token = get_token()
    response = client.post(API_AI_URL, headers={"Authorization": f"Bearer {token}"}, json={"question": "fun fact about industry diversity?"})
    assert response.status_code == 200
    assert "industries" in response.json()["answer"]

def test_ai_unknown_question():
    token = get_token()
    response = client.post(API_AI_URL, headers={"Authorization": f"Bearer {token}"}, json={"question": "What is the meaning of life?"})
    assert response.status_code == 200
    assert "sorry" in response.json()["answer"].lower()
