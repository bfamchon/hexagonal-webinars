import { User } from 'src/entities/user.entity';
import { UserFixture } from 'src/tests/user-fixture';

export const e2eUserSeeds = {
  johnDoe: new UserFixture(
    new User({
      id: 'john-doe-id',
      email: 'johndoe@gmail.com',
      password: 'azerty',
    }),
  ),
};
