import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';

export interface IAuthenticator {
  authenticate(token: string): Promise<User>;
}

export class Authenticator implements IAuthenticator {
  constructor(private readonly userRepository: IUserRepository) {}
  async authenticate(token: string): Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.props.password !== password) {
      throw new Error('Invalid password');
    }

    return user;
  }
}
