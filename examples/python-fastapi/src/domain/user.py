from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import uuid4, UUID
import re
from abc import ABC, abstractmethod

# Value Object: Domain Primitive
@dataclass(frozen=True)
class Email:
    value: str
    
    def __post_init__(self):
        if not re.match(r'^[\w\.-]+@([\w\.-]+\.[a-zA-Z]{2,})$', self.value):
            raise ValueError(f"Invalid email: {self.value}")

# Value Object: UUID Identity
@dataclass(frozen=True)
class UserId:
    value: UUID = field(default_factory=uuid4)
    
    def __str__(self):
        return str(self.value)

# Domain Event
@dataclass
class UserCreatedEvent:
    user_id: UserId
    email: Email
    occurred_at: datetime = field(default_factory=datetime.now)

# Aggregate Root
@dataclass
class User:
    id: UserId
    email: Email
    name: str
    _events: list = field(default_factory=list, repr=False)
    
    @classmethod
    def create(cls, email: Email, name: str) -> "User":
        user_id = UserId()
        user = cls(
            id=user_id,
            email=email,
            name=name
        )
        user._events.append(
            UserCreatedEvent(user_id=user_id, email=email)
        )
        return user
    
    def change_email(self, new_email: Email) -> None:
        self.email = new_email
    
    def pull_events(self) -> list:
        events = self._events.copy()
        self._events.clear()
        return events

# Repository Interface (Domain Layer)
class UserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: UserId) -> Optional[User]: ...
    
    @abstractmethod
    def find_by_email(self, email: Email) -> Optional[User]: ...
    
    @abstractmethod
    def save(self, user: User) -> None: ...
    
    @abstractmethod
    def delete(self, user_id: UserId) -> None: ...
