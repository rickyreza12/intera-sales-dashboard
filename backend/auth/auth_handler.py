from datetime import datetime, timedelta
from fastapi import Depends
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from utils.response import error_response

SECRET_KEY = "8897ABC"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token", auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Example user
fake_user = {
    "username": "admin",
    "full_name": "Ricky Reza",
    "hashed_password": pwd_context.hash("password123"),
}

#Access Handling
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

async def custom_oauth2_scheme(token: str = Depends(oauth2_scheme)):
    if not token:
        error_response(401, "Missing or invalid token")
    return token

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        error_response(401, "Invalid token")