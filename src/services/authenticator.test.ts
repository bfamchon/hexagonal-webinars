import { InMemoryUserRepository } from 'src/adapters/in-memory-user-repository';
import { User } from 'src/entities/user.entity';
import { Authenticator } from 'src/services/authenticator';

describe('Authenticator', () => {
  let userRepository: InMemoryUserRepository;
  let authenticator: Authenticator;
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    await userRepository.create(
      new User({
        id: 'id-1',
        email: 'johndoe@gmail.com',
        password: 'azerty',
      }),
    );
    authenticator = new Authenticator(userRepository);
  });
  describe('Case: User exists', () => {
    it('should authenticate a user', async () => {
      const payload = Buffer.from('johndoe@gmail.com:azerty').toString(
        'base64',
      );

      const user = await authenticator.authenticate(payload);

      expect(user.props).toEqual({
        id: 'id-1',
        email: 'johndoe@gmail.com',
        password: 'azerty',
      });
    });
  });

  describe('Case: User does not exists', () => {
    it('should fail', async () => {
      const payload = Buffer.from('unknown@gmail.com:azerty').toString(
        'base64',
      );

      await expect(() => authenticator.authenticate(payload)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('Case: Invalid password', () => {
    it('should fail', async () => {
      const payload = Buffer.from('johndoe@gmail.com:invalid').toString(
        'base64',
      );

      await expect(() => authenticator.authenticate(payload)).rejects.toThrow(
        'Invalid password',
      );
    });
  });
});
