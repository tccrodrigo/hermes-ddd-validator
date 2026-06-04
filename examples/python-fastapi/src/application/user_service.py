from typing import Optional
from ..domain.user import User, UserId, Email, UserRepository

# Application Service / Use Case
class CreateUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository
    
    def execute(self, email: str, name: str) -> User:
        email_vo = Email(value=email)
        
        # Business rule: check duplicates
        existing = self._user_repository.find_by_email(email_vo)
        if existing:
            raise ValueError(f"User with email {email} already exists")
        
        user = User.create(email_vo, name)
        self._user_repository.save(user)
        
        return user

# DTOs for API
from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    email: str
    name: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
