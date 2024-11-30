import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestApp } from 'src/tests/utils/test-app';
import { MongoUser } from 'src/users/adapters/mongo/mongo-user';
import { MongoUserRepository } from 'src/users/adapters/mongo/mongo-user-repository';
import { User } from 'src/users/entities/user.entity';
import { testUser } from 'src/users/tests/user-seeds';

describe('MongoUserRepository', () => {
  let app: TestApp;
  let model: Model<MongoUser.SchemaClass>;
  let repository: MongoUserRepository;

  async function createUserInDb(user: User) {
    const record = new model({
      _id: user.props.id,
      emailAddress: user.props.email,
      password: user.props.password,
    });
    await record.save();
  }

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    model = app.get(getModelToken(MongoUser.CollectionName));
    repository = new MongoUserRepository(model);

    await createUserInDb(testUser.alice);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('findByEmail', () => {
    it('happy path : should find a user by email if user exists', async () => {
      const user = await repository.findByEmail(testUser.alice.props.email);

      expect(user!.props).toEqual(testUser.alice.props);
    });

    it('should fail if user does not exists', async () => {
      const user = await repository.findByEmail('doesnotexists@gmail.com');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('happy path : should find a user by id if user exists', async () => {
      const user = await repository.findById(testUser.alice.props.id);

      expect(user!.props).toEqual(testUser.alice.props);
    });

    it('should fail if user does not exists', async () => {
      const user = await repository.findById('doesnotexists');
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('happy path : should create user', async () => {
      await repository.create(testUser.bob);
      const record = await model.findById(testUser.bob.props.id);

      expect(record?.toObject()).toEqual({
        _id: testUser.bob.props.id,
        emailAddress: testUser.bob.props.email,
        password: testUser.bob.props.password,
        __v: 0,
      });
    });
  });
});
