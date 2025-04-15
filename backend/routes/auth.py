from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from auth.auth_handler import authenticate_user, create_access_token
from utils.response import error_response

router = APIRouter()


@router.post("/api/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user: 
        raise error_response(401, "Invalid Credentials")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}