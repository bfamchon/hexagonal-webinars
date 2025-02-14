import * as deepObjectDiff from 'deep-object-diff';
import { Model } from 'mongoose';
import { MongoWebinar } from 'src/webinars/adapters/mongo/mongo-webinar';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

export class MongoWebinarRepository implements IWebinarRepository {
  private mapper = new WebinarMapper();
  constructor(private readonly model: Model<MongoWebinar.SchemaClass>) {}
  async findById(id: string): Promise<Webinar | null> {
    const webinarDocument = await this.model.findById(id);
    if (!webinarDocument) {
      return null;
    }
    return this.mapper.toCore(webinarDocument);
  }

  async create(webinar: Webinar): Promise<void> {
    const webinarDocument = new this.model(this.mapper.toPersistence(webinar));
    await webinarDocument.save();
  }
  async update(webinar: Webinar): Promise<void> {
    const webinarDocument = await this.model.findById(webinar.props.id);
    if (!webinarDocument) {
      return;
    }
    const diff = deepObjectDiff.diff(webinar.initialState, webinar.props);
    await webinarDocument.updateOne(diff);
    webinar.commit();
  }
  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}

export class WebinarMapper {
  toCore(webinar: MongoWebinar.SchemaClass): Webinar {
    return new Webinar({
      id: webinar._id,
      title: webinar.title,
      startDate: new Date(webinar.startDate),
      endDate: new Date(webinar.endDate),
      seats: webinar.seats,
      organizerId: webinar.organizerId,
    });
  }

  toPersistence(webinar: Webinar): MongoWebinar.SchemaClass {
    return {
      _id: webinar.props.id,
      title: webinar.props.title,
      startDate: webinar.props.startDate,
      endDate: webinar.props.endDate,
      seats: webinar.props.seats,
      organizerId: webinar.props.organizerId,
    };
  }
}
