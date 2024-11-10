import { Module } from '@nestjs/common';
import { CommonModule } from 'src/core/common.module';

import { I_DATE_GENERATOR } from 'src/core/ports/date-generator.interface';
import { I_ID_GENERATOR } from 'src/core/ports/id-generator.interface';
import { I_MAILER } from 'src/core/ports/mailer.interface';
import { I_USER_REPOSITORY } from 'src/users/ports/user-repository.interface';
import { UserModule } from 'src/users/users.module';
import { InMemoryParticipationRepository } from 'src/webinars/adapters/in-memory-participation-repository';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/in-memory-webinar-repository';
import { WebinarController } from 'src/webinars/controllers/webinar.controller';
import { I_PARTICIPATION_REPOSITORY } from 'src/webinars/ports/participation-repository.interface';
import { I_WEBINAR_REPOSITORY } from 'src/webinars/ports/webinar-repository.interface';
import { ChangeDates } from 'src/webinars/use-cases/change-dates';
import { ChangeSeats } from 'src/webinars/use-cases/change-seats';
import { OrganizeWebinars } from 'src/webinars/use-cases/organize-webinars';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [WebinarController],
  providers: [
    {
      provide: I_WEBINAR_REPOSITORY,
      useClass: InMemoryWebinarRepository,
    },
    {
      provide: I_PARTICIPATION_REPOSITORY,
      useClass: InMemoryParticipationRepository,
    },
    {
      provide: OrganizeWebinars,
      inject: [I_WEBINAR_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (repository, idGenerator, dateGenerator) =>
        new OrganizeWebinars(repository, idGenerator, dateGenerator),
    },
    {
      provide: ChangeSeats,
      inject: [I_WEBINAR_REPOSITORY],
      useFactory: (repository) => new ChangeSeats(repository),
    },
    {
      provide: ChangeDates,
      inject: [
        I_WEBINAR_REPOSITORY,
        I_DATE_GENERATOR,
        I_PARTICIPATION_REPOSITORY,
        I_USER_REPOSITORY,
        I_MAILER,
      ],
      useFactory: (
        webinarRepository,
        dateGenerator,
        participationRepository,
        userRepository,
        mailer,
      ) =>
        new ChangeDates(
          webinarRepository,
          dateGenerator,
          participationRepository,
          userRepository,
          mailer,
        ),
    },
  ],
  exports: [I_WEBINAR_REPOSITORY],
})
export class WebinarModule {}
