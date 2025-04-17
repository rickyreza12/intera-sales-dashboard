
import json
from fastapi import APIRouter, Depends, Query

from auth.auth_handler import custom_oauth2_scheme, decode_token
from utils.users import get_fake_user
from models.dummy_data import load_dummy_data
from utils.response import error_response


router = APIRouter()
    
@router.post("/sales-reps")
async def get_sales_reps(
    token: str = Depends(custom_oauth2_scheme),
    region: str = Query(default=None, description="Filter by region (e.g. 'Europe')"),
    name: str = Query(default=None, description="Filter by partial/full name"),
    role: str = Query(default=None, description="Filter by job role/title"),
    skill: str = Query(default=None, description="Filter by one of the skills (e.g. 'Negotiation')"),
    client: str = Query(default=None, description="Search client name, industry or contact"),
    deal_status: str = Query(default=None, description="Filter deals by status (e.g. 'Closed Won')"),
    min_deal_value: int = Query(default=None, description="Minimum value of any deal"),
    sort_by : str = Query(default=None, description="Field to sort by (e.g. 'deal_total')"),
    sort_order: str = Query(default="asc", description="Sorting order: 'asc' or 'desc'"),
    page: int = Query(default=1, description="Page number for pagination"),
    size: int = Query(default=10, description="Number of items per page")
):
    """
    Return responses as a filtered, sorted and pagination list of sales.
    
    **Requires JWT Bearer token in Authorization header**
    
    **Supports:**
    - Region, Name, Role, Skill, Client info, Deal status filters
    - Deal value threshold
    - Sorting by any top level numeric field (e.g deal_total)
    - pagination controls
    
    **Authorization:**
    - Validates token and user before responding
    
    **Response Format:**
    ```json
    {
        "statusCode": 200,
        "message":"Success message",
        "pagination":{total, page, size},
        "data":[...]
    }
    ```
    
    """
    username = decode_token(token)
    user = get_fake_user()
    if username != user["username"]:
            raise error_response(401, "Invalid Token")
    
    reps = load_dummy_data()["salesReps"]
    
    def match(text, keyword):
        return keyword.lower() in text.lower()

    filtered = []
    
    #Filtering logic
    
    for rep in reps:
        if name and not match(rep["name"], name):
            continue
        if region and rep["region"].lower() != region.lower():
            continue
        if role and not match(rep["role"], role):
            continue
        if skill and skill.lower() not in [skl.lower() for skl in rep["skills"]]:
            continue
        if client:
            if not any(match(cln["name"], client) or match(cln["industry"], client) or match(cln["contact"], client) for cln in rep["clients"]):
                continue
        if deal_status:
            if not any(deal["status"].lower() == deal_status.lower() for deal in rep["deals"]):
                continue
        if min_deal_value:
            if not any(deal["value"] >= min_deal_value for deal in rep["deals"]):
                continue
        rep["deal_total"] = len(rep["deals"])
        rep["client_total"] = len(rep["clients"])
        filtered.append(rep)
  
    if sort_by:
        reverse = sort_order == "desc"
        try: 
            filtered.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)
        except:
            pass  
    
    total = len(filtered)
    start = (page - 1) * size
    end = start + size
    paginated = filtered[start:end]       
    
    #Response 
    return {
        "statusCode": 200,
        "message": "Sales reps data retrieved successfully.",
        "pagination": {
            "total": total,
            "page": page,
            "size": size
        },
        "data": paginated
    }