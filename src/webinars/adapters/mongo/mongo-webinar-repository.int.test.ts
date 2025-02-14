import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestApp } from 'src/tests/utils/test-app';
import { MongoWebinar } from 'src/webinars/adapters/mongo/mongo-webinar';
import {
  MongoWebinarRepository,
  WebinarMapper,
} from 'src/webinars/adapters/mongo/mongo-webinars-repository';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { testWebinar } from 'src/webinars/tests/webinar-seeds';

describe('MongoWebinarRepository', () => {
  let app: TestApp;
  let model: Model<MongoWebinar.SchemaClass>;
  let repository: MongoWebinarRepository;
  let mapper = new WebinarMapper();
  async function createWebinarInDb(webinar: Webinar) {
    const record = new model({
      _id: webinar.props.id,
      title: webinar.props.title,
      startDate: webinar.props.startDate,
      endDate: webinar.props.endDate,
      seats: webinar.props.seats,
      organizerId: webinar.props.organizerId,
    });
    await record.save();
  }

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    model = app.get(getModelToken(MongoWebinar.CollectionName));
    repository = new MongoWebinarRepository(model);

    await createWebinarInDb(testWebinar.webinar1);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('findById', () => {
    it('should return a webinar when it exists', async () => {
      const result = await repository.findById(testWebinar.webinar1.props.id);
      expect(result?.props).toEqual(testWebinar.webinar1.props);
    });

    it('should return null when the webinar does not exist', async () => {
      const result = await repository.findById('non-existing-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a webinar', async () => {
      await repository.create(testWebinar.webinar2);
      const result = await model.findById(testWebinar.webinar2.props.id);
      expect(result).not.toBeNull();
      expect(mapper.toCore(result!).props).toEqual({
        id: testWebinar.webinar2.props.id,
        title: testWebinar.webinar2.props.title,
        startDate: testWebinar.webinar2.props.startDate,
        endDate: testWebinar.webinar2.props.endDate,
        seats: testWebinar.webinar2.props.seats,
        organizerId: testWebinar.webinar2.props.organizerId,
      });
    });
  });

  describe('update', () => {
    it('should update a webinar', async () => {
      const updatedWebinar = testWebinar.webinar1.clone() as Webinar;
      updatedWebinar.update({
        title: 'Updated Title',
        seats: 200,
      });
      await repository.update(updatedWebinar);
      const result = await model.findById(updatedWebinar.props.id);
      expect(result).not.toBeNull();
      const receivedWebinar = mapper.toCore(result!);
      expect(receivedWebinar.props).toEqual({
        id: updatedWebinar.props.id,
        title: updatedWebinar.props.title,
        startDate: updatedWebinar.props.startDate,
        endDate: updatedWebinar.props.endDate,
        seats: updatedWebinar.props.seats,
        organizerId: updatedWebinar.props.organizerId,
      });
      expect(receivedWebinar.props).toEqual(receivedWebinar.initialState);
    });
  });

  describe('delete', () => {
    it('should delete a webinar', async () => {
      await repository.delete(testWebinar.webinar1.props.id);
      const result = await model.findById(testWebinar.webinar1.props.id);
      expect(result).toBeNull();
    });
  });
});
