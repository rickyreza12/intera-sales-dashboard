
import json
from fastapi import APIRouter, Depends, Query

from auth.auth_handler import custom_oauth2_scheme, decode_token
from utils.users import get_fake_user
from models.dummy_data import load_dummy_data
from utils.response import error_response


router = APIRouter()
    
@router.post("/api/sales-reps")
async def get_sales_reps(
    token: str = Depends(custom_oauth2_scheme),
    region: str = Query(default=None),
    name: str = Query(default=None),
    role: str = Query(default=None),
    skill: str = Query(default=None),
    client: str = Query(default=None),
    deal_status: str = Query(default=None),
    min_deal_value: int = Query(default=None),
    sort_by : str = Query(default=None),
    sort_order: str = Query(default="asc"),
    page: int = Query(default=1),
    size: int = Query(default=10)
):
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