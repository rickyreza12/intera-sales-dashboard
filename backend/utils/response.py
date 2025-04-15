from fastapi import HTTPException

def error_response(status_code: int, message: str):
    raise HTTPException(
        status_code=status_code,
        detail=
        {
            "statusCode": status_code,
            "message": message,
            "data": None 
        }
    )