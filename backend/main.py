from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Query, Request, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

import uvicorn
import json

SECRET_KEY = "8897ABC"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Example user
fake_user = {
    "username": "admin",
    "full_name": "Ricky Reza",
    "hashed_password": pwd_context.hash("password123"),
}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str):
    if username != fake_user["username"]:
        return False
    if not verify_password(password, fake_user["hashed_password"]):
        return False
    return fake_user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def error_response(status_code: int, message: str):
    raise HTTPException(
        status_code=status_code,
        detail={
            "statusCode": status_code,
            "message": message,
            "data": None 
        }
    )

app = FastAPI()

# Load dummy data
with open("dummyData.json", "r") as f:
    DUMMY_DATA = json.load(f)
    
@app.post("/api/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user: 
        raise error_response(401, "Invalid Credentials")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/sales-reps")
async def get_sales_reps(
    token: str = Depends(oauth2_scheme),
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username != fake_user["username"]:
            raise error_response(401, "Invalid Token")

    except JWTError:
        raise error_response(401, "Invalid Token")

    
    reps = DUMMY_DATA["salesReps"]
    
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

# @app.get("/api/data")
# def get_data():
#     """
#     Returns dummy data (e.g., list of users).
#     """
#     return DUMMY_DATA

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns a placeholder AI response.
    (Optionally integrate a real AI model or external service here.)
    """
    body = await request.json()
    user_question = body.get("question", "")
    
    # Placeholder logic: echo the question or generate a simple response
    # Replace with real AI logic as desired (e.g., call to an LLM).
    return {"answer": f"This is a placeholder answer to your question: {user_question}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
