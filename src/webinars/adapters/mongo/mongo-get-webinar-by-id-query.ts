import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoUser } from 'src/users/adapters/mongo/mongo-user';
import { MongoParticipation } from 'src/webinars/adapters/mongo/mongo-participation';
import { MongoWebinar } from 'src/webinars/adapters/mongo/mongo-webinar';
import { WebinarDTO } from 'src/webinars/dto/webinar.dto';
import { GetWebinarByIdQuery } from 'src/webinars/ports/get-webinar-by-id-query.interface';

export class MongoGetWebinarByIdQuery implements GetWebinarByIdQuery {
  constructor(
    private readonly webinarModel: Model<MongoWebinar.SchemaClass>,
    private readonly participationModel: Model<MongoParticipation.SchemaClass>,
    private readonly userModel: Model<MongoUser.SchemaClass>,
  ) {}

  async execute(webinarId: string): Promise<WebinarDTO> {
    const webinar = await this.webinarModel.findById(webinarId);

    if (!webinar) {
      throw new NotFoundException();
    }

    const organizer = await this.userModel.findById(webinar.organizerId);

    if (!organizer) {
      throw new NotFoundException();
    }

    const participationCount = await this.participationModel.countDocuments({
      webinarId,
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
