import { Module } from '@nestjs/common';

import { InMemoryWebinarRepository } from 'src/adapters/in-memory-webinar-repository';
import { RealDateGenerator } from 'src/adapters/real-date-generator';
import { RealIdGenerator } from 'src/adapters/real-id-generator';
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
    {
      provide: OrganizeWebinars,
      inject: [InMemoryWebinarRepository, RealIdGenerator, RealDateGenerator],
      useFactory: (repository, idGenerator, dateGenerator) =>
        new OrganizeWebinars(repository, idGenerator, dateGenerator),
    },
  ],
})
export class AppModule {}
