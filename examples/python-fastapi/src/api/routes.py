from fastapi import FastAPI, HTTPException
from ..domain.user import UserRepository
from ..application.user_service import CreateUserUseCase, CreateUserRequest, UserResponse
from typing import List

app = FastAPI()

# Dependency injection (simplified - use proper DI in production)
user_repository: UserRepository = None  # Would be injected

def get_create_user_use_case() -> CreateUserUseCase:
    return CreateUserUseCase(user_repository)

@app.get("/")
async def root():
    return {"message": "DDD FastAPI Example"}

@app.post("/users", response_model=UserResponse)
async def create_user(request: CreateUserRequest):
    use_case = get_create_user_use_case()
    try:
        user = use_case.execute(request.email, request.name)
        return UserResponse(
            id=str(user.id),
            email=user.email.value,
            name=user.name
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = user_repository.find_by_id(UserId(value=UUID(user_id)))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=str(user.id),
        email=user.email.value,
        name=user.name
    )
