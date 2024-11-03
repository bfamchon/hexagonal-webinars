import { addDays } from 'date-fns';
import {
  I_WEBINAR_REPOSITORY,
  IWebinarRepository,
} from 'src/ports/webinar-repository.interface';
import { TestApp } from 'src/tests/test-app';
import { e2eUserSeeds } from 'src/tests/user-seeds';
import * as request from 'supertest';

describe('Feature: Organize webinar', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    await app.loadFixtures([e2eUserSeeds.johnDoe]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: happy path', () => {
    it('should create a webinar', async () => {
      const startDate = addDays(new Date(), 4);
      const endDate = addDays(new Date(), 5);
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .set('Authorization', e2eUserSeeds.johnDoe.createAuthorizationToken())
        .send({
          title: 'Webinar title',
          seats: 100,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(result.status).toBe(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
      const webinar = await webinarRepository.findById(result.body.id);

      expect(webinar!.props).toEqual({
        id: result.body.id,
        organizerId: 'john-doe-id',
        title: 'Webinar title',
        startDate: startDate,
        endDate: endDate,
        seats: 100,
      });
    });
  });

  describe('Scenario: user not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .send({
          title: 'Webinar title',
          seats: 100,
          startDate: addDays(new Date(), 4).toISOString(),
          endDate: addDays(new Date(), 5).toISOString(),
        });

      expect(result.status).toBe(403);
    });
  });
});
