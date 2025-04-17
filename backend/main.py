from fastapi import FastAPI, Query, Request, Security, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from auth.auth_handler import(
    authenticate_user,
    create_access_token,
    custom_oauth2_scheme,
    decode_token
)

import uvicorn

from routes import register_routes


#Route handling
app = FastAPI()
#Cors configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#Mount static
app.mount("/static", StaticFiles(directory="static"), name="static")

#ROUTER 
register_routes(app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
