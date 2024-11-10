import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(public readonly database: User[] = []) {}

  async create(user: User): Promise<void> {
    this.database.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.database.find((user) => user.props.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.database.find((user) => user.props.id === id) || null;
  }
}
