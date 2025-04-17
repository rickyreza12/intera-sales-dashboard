from fastapi import FastAPI, Query, Request, Security, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from auth.auth_handler import(
    authenticate_user,
    create_access_token,
    custom_oauth2_scheme,
    decode_token
)

import uvicorn
import json

from routes import ai, auth, sales_reps, sales_sumary, sales_deal


#Route handling
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(sales_reps.router)
app.include_router(auth.router)
app.include_router(ai.router)
app.include_router(sales_sumary.router)
app.include_router(sales_deal.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
