from pydantic import BaseModel
from typing import List

class RevenueByRegion(BaseModel):
    region: str
    value: int
    
class SalesSummaryData(BaseModel):
    total_revenue: int
    in_progress_revenue: int
    revenue_by_region: List[RevenueByRegion]

class SalesSummaryResponse(BaseModel):
    statusCode: int
    message: str
    data: SalesSummaryData