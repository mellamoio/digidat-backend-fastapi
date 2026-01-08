from fastapi.responses import JSONResponse

def custom_response(code: int, message: str, response_code: bool = True, data: dict | list | None = None):
    return JSONResponse(
        status_code=code,
        content={
            "code": code,
            "message": message,
            "response_code": response_code,
            "data": data
        }
    )