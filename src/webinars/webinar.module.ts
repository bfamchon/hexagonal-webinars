import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/core/common.module';
import { I_GET_WEBINAR_BY_ID_QUERY } from 'src/webinars/ports/get-webinar-by-id-query.interface';

import { I_DATE_GENERATOR } from 'src/core/ports/date-generator.interface';
import { I_ID_GENERATOR } from 'src/core/ports/id-generator.interface';
import { I_MAILER } from 'src/core/ports/mailer.interface';
import { MongoUser } from 'src/users/adapters/mongo/mongo-user';
import { I_USER_REPOSITORY } from 'src/users/ports/user-repository.interface';
import { UserModule } from 'src/users/users.module';
import { MongoGetWebinarByIdQuery } from 'src/webinars/adapters/mongo/mongo-get-webinar-by-id-query';
import { MongoParticipation } from 'src/webinars/adapters/mongo/mongo-participation';
import { MongoParticipationRepository } from 'src/webinars/adapters/mongo/mongo-participation-repository';
import { MongoWebinar } from 'src/webinars/adapters/mongo/mongo-webinar';
import { MongoWebinarRepository } from 'src/webinars/adapters/mongo/mongo-webinars-repository';
import { ParticipationController } from 'src/webinars/controllers/participation.controller';
import { WebinarController } from 'src/webinars/controllers/webinar.controller';
import { I_PARTICIPATION_REPOSITORY } from 'src/webinars/ports/participation-repository.interface';
import { I_WEBINAR_REPOSITORY } from 'src/webinars/ports/webinar-repository.interface';
import { BookSeat } from 'src/webinars/use-cases/book-seat';
import { CancelSeat } from 'src/webinars/use-cases/cancel-seat';
import { CancelWebinar } from 'src/webinars/use-cases/cancel-webinar';
import { ChangeDates } from 'src/webinars/use-cases/change-dates';
import { ChangeSeats } from 'src/webinars/use-cases/change-seats';
import { OrganizeWebinars } from 'src/webinars/use-cases/organize-webinars';

@Module({
  imports: [
    CommonModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: MongoWebinar.CollectionName,
        schema: MongoWebinar.Schema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: MongoParticipation.CollectionName,
        schema: MongoParticipation.Schema,
      },
    ]),
  ],
  controllers: [WebinarController, ParticipationController],
  providers: [
    {
      provide: I_GET_WEBINAR_BY_ID_QUERY,
      inject: [
        getModelToken(MongoWebinar.CollectionName),
        getModelToken(MongoParticipation.CollectionName),
        getModelToken(MongoUser.CollectionName),
      ],
      useFactory: (webinarModel, participationModel, userModel) =>
        new MongoGetWebinarByIdQuery(
          webinarModel,
          participationModel,
          userModel,
        ),
    },
    {
      provide: I_WEBINAR_REPOSITORY,
      inject: [getModelToken(MongoWebinar.CollectionName)],
      useFactory: (model) => new MongoWebinarRepository(model),
    },
    {
      provide: I_PARTICIPATION_REPOSITORY,
      inject: [getModelToken(MongoParticipation.CollectionName)],
      useFactory: (model) => new MongoParticipationRepository(model),
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
    {
      provide: CancelWebinar,
      inject: [
        I_WEBINAR_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_USER_REPOSITORY,
        I_MAILER,
      ],
      useFactory: (
        webinarRepository,
        participationRepository,
        userRepository,
        mailer,
      ) =>
        new CancelWebinar(
          webinarRepository,
          participationRepository,
          userRepository,
          mailer,
        ),
    },
    {
      provide: BookSeat,
      inject: [
        I_PARTICIPATION_REPOSITORY,
        I_USER_REPOSITORY,
        I_WEBINAR_REPOSITORY,
        I_MAILER,
      ],
      useFactory: (
        participationRepository,
        userRepository,
        webinarRepository,
        mailer,
      ) =>
        new BookSeat(
          participationRepository,
          userRepository,
          webinarRepository,
          mailer,
        ),
    },
    {
      provide: CancelSeat,
      inject: [
        I_WEBINAR_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_USER_REPOSITORY,
        I_MAILER,
      ],
      useFactory: (
        webinarRepository,
        participationRepository,
        userRepository,
        mailer,
      ) =>
        new CancelSeat(
          webinarRepository,
          participationRepository,
          userRepository,
          mailer,
        ),
    },
  ],
  exports: [I_WEBINAR_REPOSITORY],
})
export class WebinarModule {}
