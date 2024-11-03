import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { InMemoryUserRepository } from 'src/adapters/in-memory-user-repository';
import { InMemoryWebinarRepository } from 'src/adapters/in-memory-webinar-repository';
import { RealDateGenerator } from 'src/adapters/real-date-generator';
import { RealIdGenerator } from 'src/adapters/real-id-generator';
import { AuthGuard } from 'src/app/auth.guard';
import { I_DATE_GENERATOR } from 'src/ports/date-generator.interface';
import { I_ID_GENERATOR } from 'src/ports/id-generator.interface';
import { I_USER_REPOSITORY } from 'src/ports/user-repository.interface';
import { I_WEBINAR_REPOSITORY } from 'src/ports/webinar-repository.interface';
import { Authenticator } from 'src/services/authenticator';
import { OrganizeWebinars } from 'src/usecases/organize-webinars';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: I_DATE_GENERATOR,
      useClass: RealDateGenerator,
    },
    {
      provide: I_ID_GENERATOR,
      useClass: RealIdGenerator,
    },
    {
      provide: I_USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: I_WEBINAR_REPOSITORY,
      useClass: InMemoryWebinarRepository,
    },
    {
      provide: OrganizeWebinars,
      inject: [I_WEBINAR_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (repository, idGenerator, dateGenerator) =>
        new OrganizeWebinars(repository, idGenerator, dateGenerator),
    },
    {
      provide: Authenticator,
      inject: [I_USER_REPOSITORY],
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
