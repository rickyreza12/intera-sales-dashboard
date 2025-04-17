from fastapi import APIRouter, Depends
from collections import defaultdict
from auth.auth_handler import custom_oauth2_scheme, decode_token
from models.deal_response import DealStatusItem, DealStatusResponse, DealStatusSummary
from utils.users import get_fake_user
from utils.response import error_response
from config.dummy_data import load_dummy_data

router = APIRouter()

@router.post("/deal-status", response_model=DealStatusResponse)
def get_deal_status_breakdown(token: str = Depends(custom_oauth2_scheme)):
    """
    Get a breakdown of deals grouped by status.

    **Requires JWT Bearer token in Authorization header**

    **Returns:**
    - A summary count of deals grouped into:
        - "Closed Won"
        - "In Progress"
        - "Closed Lost"
    - Total number of deals
    - Total value of all deals

    **Authorization:**
    - Validates JWT and user access before returning data.

    **Response Format:**
    ```json
    {
        "statusCode": 200,
        "message": "Deal status breakdown generated successfully",
        "data": {
            "summary": [
                {"status": "Closed Won", "count": 3, "value": 100000},
                {"status": "In Progress", "count": 2, "value": 80000},
                {"status": "Closed Lost", "count": 1, "value": 50000}
            ],
            "total_deals": 6,
            "total_value": 230000
        }
    }
    ```
    """
    username =decode_token(token)
    user = get_fake_user()
    if username != user["username"]:
        raise error_response(401, "Invalid Token")

    reps = load_dummy_data()["salesReps"]
    status_summary = defaultdict(lambda: {"count" : 0, "value": 0})
    total_deals = 0
    total_values = 0
    
    for rep in reps:
        for deal in rep["deals"]:
            total_deals += 1
            total_values += deal["value"]
            status_summary[deal["status"]]["count"] += 1
            status_summary[deal["status"]]["value"] += deal["value"]
    
    summary = [
        DealStatusSummary(status=status, count=info["count"], value=info["value"]) for status, info in status_summary.items()
    ]
    
    return DealStatusResponse(
        statusCode=200,
        message="Deal status breakdown generated successfuully",
        data= DealStatusItem(
            summary=summary, 
            total_deals=total_deals, 
            total_value=total_values
        )
    )