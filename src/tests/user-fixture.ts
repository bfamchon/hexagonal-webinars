import { InMemoryUserRepository } from 'src/adapters/in-memory-user-repository';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from 'src/ports/user-repository.interface';
import { IFixture } from 'src/tests/fixture';
import { TestApp } from 'src/tests/test-app';

export class UserFixture implements IFixture {
  constructor(public entity: User) {}
  async load(app: TestApp): Promise<void> {
    const userRepository = app.get<IUserRepository>(InMemoryUserRepository);
    await userRepository.create(this.entity);
  }

  createAuthorizationToken() {
    return (
      'Basic ' +
      Buffer.from(
        `${this.entity.props.email}:${this.entity.props.password}`,
      ).toString('base64')
    );
  }
}
