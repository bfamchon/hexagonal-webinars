import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestApp } from 'src/tests/utils/test-app';
import { MongoParticipation } from 'src/webinars/adapters/mongo/mongo-participation';
import {
  MongoParticipationRepository,
  ParticipationMapper,
} from 'src/webinars/adapters/mongo/mongo-participation-repository';
import { Participation } from 'src/webinars/entities/participation.entity';
import { testParticipation } from 'src/webinars/tests/participation-seeds';

describe('MongoParticipationRepository', () => {
  let app: TestApp;
  let model: Model<MongoParticipation.SchemaClass>;
  let repository: MongoParticipationRepository;
  let mapper = new ParticipationMapper();
  async function createParticipationInDb(participation: Participation) {
    const record = new model({
      _id: MongoParticipation.SchemaClass.makeId(participation),
      userId: participation.props.userId,
      webinarId: participation.props.webinarId,
    });
    await record.save();
  }

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    model = app.get(getModelToken(MongoParticipation.CollectionName));
    repository = new MongoParticipationRepository(model);

    await createParticipationInDb(testParticipation.participation1);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('findByUserIdAndWebinarId', () => {
    it('should return a participation if it exists', async () => {
      const participation = await repository.findByUserIdAndWebinarId({
        userId: testParticipation.participation1.props.userId,
        webinarId: testParticipation.participation1.props.webinarId,
      });

      expect(participation?.props).toEqual(
        testParticipation.participation1?.props,
      );
    });

    it('should return null if the participation does not exist', async () => {
      const participation = await repository.findByUserIdAndWebinarId({
        userId: 'non-existing-user',
        webinarId: 'non-existing-webinar',
      });

      expect(participation).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a participation', async () => {
      const participation = testParticipation.participation2;
      await repository.save(participation);

      const record = await model.findById(
        MongoParticipation.SchemaClass.makeId(participation),
      );

      expect(record).toMatchObject({
        userId: participation.props.userId,
        webinarId: participation.props.webinarId,
      });
    });
  });

  describe('delete', () => {
    it('should delete a participation', async () => {
      await repository.delete(testParticipation.participation1);

      const record = await model.findById(
        MongoParticipation.SchemaClass.makeId(testParticipation.participation1),
      );

      expect(record).toBeNull();
    });
  });

  describe('findByWebinarId', () => {
    it('should return an array of participations', async () => {
      await createParticipationInDb(testParticipation.participation2);

      const participations = await repository.findByWebinarId(
        testParticipation.participation1.props.webinarId,
      );

      expect(participations).toHaveLength(2);
      expect(participations[0].props).toEqual(
        testParticipation.participation1.props,
      );
      expect(participations[1].props).toEqual(
        testParticipation.participation2.props,
      );
    });
  });
});
