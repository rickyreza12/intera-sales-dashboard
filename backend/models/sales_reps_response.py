from pydantic import BaseModel
from typing import List

class Deal(BaseModel):
    client: str
    value: int
    status: str

class Client(BaseModel):
    name: str
    industry: str
    contact: str

class SalesRep(BaseModel):
    id: int
    name: str
    role: str
    region: str
    skills: List[str]
    deals: List[Deal]
    clients: List[Client]
    deal_total: int
    client_total: int

class Pagination(BaseModel):
    total: int
    page: int
    size: int

class SalesRepsResponse(BaseModel):
    statusCode: int 
    message: str
    pagination: Pagination
    data: List[SalesRep]
