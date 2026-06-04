// Repository Interface (Domain Layer)
import { User } from './User';
import { UserId } from './UserId';
import { Email } from './Email';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
