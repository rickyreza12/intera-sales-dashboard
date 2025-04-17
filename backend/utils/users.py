# Example user
from config.settings import settings
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_fake_user():
    return {
    "username": settings.APP_USERNAME,
    "full_name": "Ricky Reza",
    "hashed_password": pwd_context.hash(settings.APP_PASSWORD),
}