from pydantic import BaseModel
from typing import List

class TopRep(BaseModel):
    name:str
    revenue: int
    image: str

class TopRepsResponse(BaseModel):
    statusCode: int
    message: str
    data: List[TopRep]