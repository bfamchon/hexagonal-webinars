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

describe('Feature: Cancel webinar', () => {
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
    it('should cancel a webinar', async () => {
      const webinarId = 'webinar-id';
      const result = await request(app.getHttpServer())
        .delete(`/webinars/${webinarId}`)
        .set('Authorization', e2eUserSeeds.johnDoe.createAuthorizationToken());

      expect(result.status).toBe(200);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
      const webinar = await webinarRepository.findById(webinarId);
      expect(webinar).toBeNull();
    });
  });

  describe('Scenario: user not authenticated', () => {
    it('should reject', async () => {
      const webinarId = 'webinar-id';
      const result = await request(app.getHttpServer()).delete(
        `/webinars/${webinarId}`,
      );

      expect(result.status).toBe(403);
    });
  });
});
