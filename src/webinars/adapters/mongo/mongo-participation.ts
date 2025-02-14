import {
  Schema as MongooseSchema,
  Prop,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Participation } from 'src/webinars/entities/participation.entity';

export namespace MongoParticipation {
  export const CollectionName = 'participation';

  @MongooseSchema({ collection: CollectionName })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop({ type: String })
    userId: string;

    @Prop({ type: String })
    webinarId: string;

    static makeId(participation: Participation): string {
      return `${participation.props.userId}:${participation.props.webinarId}`;
    }
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}
