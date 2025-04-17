from pydantic import BaseModel
from typing import List

class DealStatusSummary(BaseModel):
    status: str
    count: int
    value: int

class DealStatusItem(BaseModel):
    summary: List[DealStatusSummary]
    total_deals: int
    total_value: int

class DealStatusResponse(BaseModel):
    statusCode: int
    message: str
    data: DealStatusItem