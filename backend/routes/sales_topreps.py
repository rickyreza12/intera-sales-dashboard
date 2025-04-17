from fastapi import APIRouter, Depends

from auth.auth_handler import custom_oauth2_scheme, decode_token
from config.settings import settings
from models.dummy_data import load_dummy_data
from utils.response import error_response
from utils.users import get_fake_user
from models.top_sales_response import TopRep, TopRepsResponse


router = APIRouter(prefix="/api/sales", tags=["Sales"])

@router.post("/top-reps", response_model=TopRepsResponse)
def get_top_reps(token: str = Depends(custom_oauth2_scheme)):
    """
    Get the top 3 sales representatives ranked by total revenue from "Closed Won" deals.

    **Requires JWT Bearer token in Authorization heder**

    **Returns:**
    - Name, revnue, and image (avatar URL) of the top 3 performers

    **Response Format:**
    ```json
    {
        "statusCode": 200,
        "message": "Top reps retrieved successfully",
        "data": [
            { "name": "Alice", "revenue": 120000, "image": "..." },
            { "name": "Eve", "revenue": 95000, "image": "..." },
            ...
        ]
    }
    
    """
    username = decode_token(token)
    user = get_fake_user()
    if username != user["username"]:
        raise error_response(401, "Invalid Token")
    
    reps = load_dummy_data()["salesReps"]
    
    top_reps = []
    for rep in reps:
        total_revenue = sum(deal["value"] for deal in rep["deals"] if deal["status"] == "Closed Won")
        top_reps.append(TopRep(
            name=rep["name"],
            revenue=total_revenue,
            image=f"{settings.DEV_HOST}/static/avatars/{rep["name"]}.jpg"
        ))
        
    top_reps_sorted = sorted(top_reps, key=lambda r: r.revenue, reverse=True)[:3]
    
    return TopRepsResponse(
        statusCode=200,
        message="Top reps retrieved successfully",
        data=top_reps_sorted
    )
    