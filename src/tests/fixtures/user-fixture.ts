import { IFixture } from 'src/tests/utils/fixture';
import { TestApp } from 'src/tests/utils/test-app';
import { User } from 'src/users/entities/user.entity';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from 'src/users/ports/user-repository.interface';

export class UserFixture implements IFixture {
  constructor(public entity: User) {}
  async load(app: TestApp): Promise<void> {
    const userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);
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
