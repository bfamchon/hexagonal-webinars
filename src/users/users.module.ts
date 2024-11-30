import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/core/common.module';

import { MongoUser } from 'src/users/adapters/mongo/mongo-user';
import { MongoUserRepository } from 'src/users/adapters/mongo/mongo-user-repository';
import { I_USER_REPOSITORY } from 'src/users/ports/user-repository.interface';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: MongoUser.CollectionName,
        schema: MongoUser.Schema,
      },
    ]),
  ],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      inject: [getModelToken(MongoUser.CollectionName)],
      useFactory: (model) => new MongoUserRepository(model),
    },
  ],
  exports: [I_USER_REPOSITORY],
})
export class UserModule {}
