import { Model } from 'mongoose';
import { MongoUser } from 'src/users/adapters/mongo/mongo-user';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';

export class MongoUserRepository implements IUserRepository {
  private mapper = new UserMapper();
  constructor(private readonly model: Model<MongoUser.SchemaClass>) {}
  async findByEmail(email: string) {
    const user = await this.model.findOne({ emailAddress: email });
    if (!user) {
      return null;
    }
    return this.mapper.toCore(user);
  }
  async findById(id: string) {
    const user = await this.model.findById(id);
    if (!user) {
      return null;
    }
    return this.mapper.toCore(user);
  }
  async create(user: User) {
    const record = new this.model(this.mapper.toPersistence(user));
    await record.save();
  }
}

class UserMapper {
  toCore(user: MongoUser.SchemaClass): User {
    return new User({
      id: user._id,
      email: user.emailAddress,
      password: user.password,
    });
  }

  toPersistence(user: User): MongoUser.SchemaClass {
    return {
      _id: user.props.id,
      emailAddress: user.props.email,
      password: user.props.password,
    };
  }
}
