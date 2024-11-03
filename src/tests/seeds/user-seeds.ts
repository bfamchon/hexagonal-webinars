import { UserFixture } from 'src/tests/fixtures/user-fixture';
import { User } from 'src/users/entities/user.entity';

export const e2eUserSeeds = {
  johnDoe: new UserFixture(
    new User({
      id: 'john-doe-id',
      email: 'johndoe@gmail.com',
      password: 'azerty',
    }),
  ),
};
