import { User } from 'src/users/entities/user.entity';

export const I_USER_REPOSITORY = 'I_USER_REPOSITORY';
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
