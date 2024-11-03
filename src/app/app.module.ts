import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { InMemoryUserRepository } from 'src/adapters/in-memory-user-repository';
import { InMemoryWebinarRepository } from 'src/adapters/in-memory-webinar-repository';
import { RealDateGenerator } from 'src/adapters/real-date-generator';
import { RealIdGenerator } from 'src/adapters/real-id-generator';
import { AuthGuard } from 'src/app/auth.guard';
import { Authenticator } from 'src/services/authenticator';
import { OrganizeWebinars } from 'src/usecases/organize-webinars';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    RealDateGenerator,
    RealIdGenerator,
    InMemoryWebinarRepository,
    InMemoryUserRepository,
    {
      provide: OrganizeWebinars,
      inject: [InMemoryWebinarRepository, RealIdGenerator, RealDateGenerator],
      useFactory: (repository, idGenerator, dateGenerator) =>
        new OrganizeWebinars(repository, idGenerator, dateGenerator),
    },
    {
      provide: Authenticator,
      inject: [InMemoryUserRepository],
      useFactory: (userRepository) => new Authenticator(userRepository),
    },
    {
      provide: APP_GUARD,
      inject: [Authenticator],
      useFactory: (authenticator) => new AuthGuard(authenticator),
    },
  ],
})
export class AppModule {}
