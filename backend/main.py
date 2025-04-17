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

from routes import ai, auth, sales_reps, sales_sumary, sales_deal, sales_clients,sales_topreps


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
app.include_router(sales_reps.router)
app.include_router(auth.router)
app.include_router(ai.router)
app.include_router(sales_sumary.router)
app.include_router(sales_deal.router)
app.include_router(sales_clients.router)
app.include_router(sales_topreps.router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
