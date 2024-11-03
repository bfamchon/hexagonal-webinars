import { User } from 'src/entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}
