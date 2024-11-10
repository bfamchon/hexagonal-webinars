import { addDays } from 'date-fns';
import { WebinarFixture } from 'src/tests/fixtures/webinar-fixture';
import { e2eUserSeeds } from 'src/tests/seeds/user-seeds';
import { TestApp } from 'src/tests/utils/test-app';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import {
  I_WEBINAR_REPOSITORY,
  IWebinarRepository,
} from 'src/webinars/ports/webinar-repository.interface';
import * as request from 'supertest';

describe('Feature: Change dates', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    await app.loadFixtures([
      e2eUserSeeds.johnDoe,
      new WebinarFixture(
        new Webinar({
          id: 'webinar-id',
          title: 'Webinar title',
          startDate: addDays(new Date(), 2),
          endDate: addDays(new Date(), 2),
          seats: 50,
          organizerId: e2eUserSeeds.johnDoe.entity.props.id,
        }),
      ),
    ]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: happy path', () => {
    it('should change dates', async () => {
      const webinarId = 'webinar-id';
      const startDate = addDays(new Date(), 6);
      const endDate = addDays(new Date(), 6);
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/dates`)
        .set('Authorization', e2eUserSeeds.johnDoe.createAuthorizationToken())
        .send({
          startDate,
          endDate,
        });

      expect(result.status).toBe(200);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
      const webinar = await webinarRepository.findById(webinarId);
      expect(webinar!.props.startDate).toEqual(startDate);
      expect(webinar!.props.endDate).toEqual(endDate);
    });
  });

  describe('Scenario: user not authenticated', () => {
    it('should reject', async () => {
      const webinarId = 'webinar-id';
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/dates`)
        .send({
          startDate: '2021-01-01T01:00:00.000Z',
          endDate: '2021-01-01T02:00:00.000Z',
        });

      expect(result.status).toBe(403);
    });
  });
});
