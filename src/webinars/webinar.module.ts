import { Module } from '@nestjs/common';
import { CommonModule } from 'src/core/common.module';

import { I_DATE_GENERATOR } from 'src/core/ports/date-generator.interface';
import { I_ID_GENERATOR } from 'src/core/ports/id-generator.interface';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/in-memory-webinar-repository';
import { WebinarController } from 'src/webinars/controllers/webinar.controller';
import { I_WEBINAR_REPOSITORY } from 'src/webinars/ports/webinar-repository.interface';
import { OrganizeWebinars } from 'src/webinars/use-cases/organize-webinars';

@Module({
  imports: [CommonModule],
  controllers: [WebinarController],
  providers: [
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
  ],
  exports: [I_WEBINAR_REPOSITORY],
})
export class WebinarModule {}
