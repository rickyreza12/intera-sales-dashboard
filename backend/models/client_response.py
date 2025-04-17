from pydantic import BaseModel
from typing import List, Optional

class ClientInfo(BaseModel):
    name: str
    industry: str
    appearances: int
    contact: Optional[str] = None
    
class ClientOverviewResponse(BaseModel):
    statusCode: int
    message: str
    data: List[ClientInfo]