// Application Service: CreateUserUseCase
import { User } from '../../domain/user/User';
import { UserId } from '../../domain/user/UserId';
import { Email } from '../../domain/user/Email';
import { UserRepository } from '../../domain/user/UserRepository';

export interface CreateUserRequest {
  id: string;
  email: string;
  name: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(request: CreateUserRequest): Promise<void> {
    const userId = UserId.create(request.id);
    const email = Email.create(request.email);
    
    // Check if email exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const user = User.create(userId, email, request.name);
    await this.userRepository.save(user);
  }
}
