import { NotFoundException } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { MongoUser } from 'src/users/adapters/mongo/mongo-user';
import { MongoParticipation } from 'src/webinars/adapters/mongo/mongo-participation';
import { MongoWebinar } from 'src/webinars/adapters/mongo/mongo-webinar';
import { WebinarDTO } from 'src/webinars/dto/webinar.dto';

export class GetWebinarByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetWebinarByIdQuery)
export class GetWebinarByIdQueryHandler
  implements IQueryHandler<GetWebinarByIdQuery>
{
  constructor(
    private readonly webinarModel: Model<MongoWebinar.SchemaClass>,
    private readonly participationModel: Model<MongoParticipation.SchemaClass>,
    private readonly userModel: Model<MongoUser.SchemaClass>,
  ) {}

  async execute({ id }: GetWebinarByIdQuery): Promise<WebinarDTO> {
    const webinar = await this.webinarModel.findById(id);

    if (!webinar) {
      throw new NotFoundException();
    }

    const organizer = await this.userModel.findById(webinar.organizerId);

    if (!organizer) {
      throw new NotFoundException();
    }

    const participationCount = await this.participationModel.countDocuments({
      webinarId: id,
    });

    return {
      id: webinar.id,
      title: webinar.title,
      startDate: webinar.startDate,
      endDate: webinar.endDate,
      seats: {
        available: webinar.seats - participationCount,
        reserved: participationCount,
      },
      organizer: {
        id: organizer.id,
        emailAddress: organizer.emailAddress,
      },
    };
  }
}
