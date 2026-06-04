// Entity: User (Aggregate Root)
import { UserId } from './UserId';
import { Email } from './Email';
import { UserCreatedEvent } from './events/UserCreatedEvent';

export class User {
  private constructor(
    private readonly id: UserId,
    private email: Email,
    private name: string
  ) {}
  
  static create(id: UserId, email: Email, name: string): User {
    const user = new User(id, email, name);
    // Record domain event
    user.triggerEvent(new UserCreatedEvent(id.toString(), email.toString()));
    return user;
  }
  
  getId(): UserId {
    return this.id;
  }
  
  getEmail(): Email {
    return this.email;
  }
  
  updateEmail(newEmail: Email): void {
    this.email = newEmail;
  }
  
  private triggerEvent(event: UserCreatedEvent): void {
    // Domain event recording logic
    console.log('Event recorded:', event);
  }
}
