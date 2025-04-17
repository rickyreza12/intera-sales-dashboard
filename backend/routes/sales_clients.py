from collections import defaultdict
from fastapi import APIRouter, Depends

from auth.auth_handler import custom_oauth2_scheme, decode_token
from models.dummy_data import load_dummy_data
from utils.response import error_response
from utils.users import get_fake_user
from models.client_response import ClientInfo, ClientOverviewResponse


router = APIRouter()

@router.post("/clients", response_model=ClientOverviewResponse)
def get_client_overview(token: str = Depends(custom_oauth2_scheme)):
    """
    Get overview of all unique clients across all sales reps.

    **Requires JWT Bearer token in Authorization header**

    **Returns:**
    - Unique client names
    - Industry
    - Number of times the client appears across reps
    - Contoct email if available

    **Authorization:**
    - Validates JWT and user access

    **Response Format:**
    ```json
    {
        "statusCode": 200,
        "message": "Client overrview generated successfully",
        "data": [
            {
                "name": "Acme Corp",
                "industry": "Manufacturing",
                "appearances": 2,
                "contact": "alice@acmecorp.com"
            },
            ...
        ]
    }
    """
    username = decode_token(token)
    user = get_fake_user()
    if username != user["username"]:
        raise error_response(401, "Invalid Token")
    
    reps = load_dummy_data()["salesReps"]
    client_map = defaultdict(lambda: {"industry": "", "contact":"", "appearances":0})
    
    for rep in reps:
        for client in rep["clients"]:
            name = client["name"]
            client_map[name]["industry"] = client["industry"]
            client_map[name]["contact"] = client.get("contact","")
            client_map[name]["appearances"] += 1
    
    client_list = [
        ClientInfo(
            name=name,
            industry=info["industry"],
            contact=info["contact"],
            appearances=info["appearances"]
        )
        for name, info in client_map.items()
    ]
    
    return ClientOverviewResponse(
        statusCode=200,
        message="CLient overview generated successfully",
        data=client_list
    )