import { Model } from 'mongoose';
import { MongoParticipation } from 'src/webinars/adapters/mongo/mongo-participation';
import { Participation } from 'src/webinars/entities/participation.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';

export class MongoParticipationRepository implements IParticipationRepository {
  private mapper = new ParticipationMapper();
  constructor(private readonly model: Model<MongoParticipation.SchemaClass>) {}

  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    const document = await this.model.find({ webinarId });
    return document.map((doc) => this.mapper.toCore(doc));
  }
  async findByUserIdAndWebinarId({
    userId,
    webinarId,
  }: {
    userId: string;
    webinarId: string;
  }): Promise<Participation | null> {
    const document = await this.model.findById(`${userId}:${webinarId}`);
    if (!document) {
      return null;
    }
    return this.mapper.toCore(document);
  }
  async save(participation: Participation): Promise<void> {
    const document = this.mapper.toPersistence(participation);
    await this.model.create(document);
    return;
  }
  async delete(participation: Participation): Promise<void> {
    await this.model.findByIdAndDelete(
      `${participation.props.userId}:${participation.props.webinarId}`,
    );
    return;
  }
}

export class ParticipationMapper {
  toCore(webinar: MongoParticipation.SchemaClass): Participation {
    return new Participation({
      userId: webinar.userId,
      webinarId: webinar.webinarId,
    });
  }

  toPersistence(participation: Participation): MongoParticipation.SchemaClass {
    return {
      _id: MongoParticipation.SchemaClass.makeId(participation),
      userId: participation.props.userId,
      webinarId: participation.props.webinarId,
    };
  }
}
