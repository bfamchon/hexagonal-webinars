import { Module } from '@nestjs/common';
import { CommonModule } from 'src/core/common.module';

import { InMemoryUserRepository } from 'src/users/adapters/in-memory-user-repository';
import { I_USER_REPOSITORY } from 'src/users/ports/user-repository.interface';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [I_USER_REPOSITORY],
})
export class UserModule {}
