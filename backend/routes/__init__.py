from fastapi import FastAPI
from . import (
    auth,
    ai,
    sales_reps,
    sales_sumary,
    sales_deal,
    sales_clients,
    sales_topreps
)

prefix = "/api/sales"
tags ="Sales"

def register_routes(app):
    app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
    app.include_router(auth.router, prefix="/api/token", tags=["Auth"])
    
    app.include_router(sales_reps.router, prefix=prefix, tags=[tags])
    app.include_router(sales_sumary.router, prefix=prefix, tags=[tags])
    app.include_router(sales_deal.router, prefix=prefix, tags=[tags])
    app.include_router(sales_clients.router, prefix=prefix, tags=[tags])
    app.include_router(sales_topreps.router, prefix=prefix, tags=[tags])