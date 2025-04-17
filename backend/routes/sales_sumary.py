from collections import defaultdict
from fastapi import APIRouter, Depends
from auth.auth_handler import custom_oauth2_scheme, decode_token
from models.summary_response import RevenueByRegion, SalesSummaryData, SalesSummaryResponse
from models.dummy_data import load_dummy_data
from utils.users import get_fake_user
from utils.response import error_response

router = APIRouter()

@router.post("/summary", response_model=SalesSummaryResponse)
def get_sales_summary(token: str = Depends(custom_oauth2_scheme)):
    """
    Generate sales summary including total revenue, in-progress revenue,
    and aggregated revenue by region.

    **Requires JWT Bearer token in Authorization header**

    **Returns:**
    - Total revenue from deals with status `"Closed Won"`
    - Revenue from deals currently `"In Progress"`
    - Revenue grouped by sales rep's region

    **Authorization:**
    - Validates token and user before responding

    **Response Format:**
    ```json
    {
        "statusCode": 200,
        "message": "Summary generated successfully",
        "data": {
            "total_revenue": 445000,
            "in_progress_revenue": 380000,
            "revenue_by_region": [
                { "region": "Europe", "value": 90000 },
                { "region": "North America", "value": 120000 }
                ...
            ]
        }
    }
    ```
    """
    username = decode_token(token)
    user = get_fake_user()
    if username != user["username"]:
        raise error_response(401, "Invalid Token")
    
    reps = load_dummy_data()["salesReps"]
    
    total_revenue = 0
    in_progress_revenue = 0
    region_totals = defaultdict(int)
    
    #Looping for sales rep to get the data 
    for rep in reps:
        region = rep["region"]
        for deal in rep["deals"]:
            if deal["status"] == "Closed Won":
                total_revenue += deal["value"]
                region_totals[region] += deal["value"]
            if deal["status"] == "In Progress":
                in_progress_revenue += deal["value"]
        
    revenue_by_region = [
        RevenueByRegion(region=region, value=value)
        for region, value in region_totals.items()
    ]
    
    #Response
    return SalesSummaryResponse(
        statusCode=200,
        message="Summary generated successfully",
        data=SalesSummaryData(
            total_revenue=total_revenue,
            in_progress_revenue=in_progress_revenue,
            revenue_by_region=revenue_by_region
        )
    )
