import { WebinarFixture } from 'src/tests/fixtures/webinar-fixture';
import { e2eUserSeeds } from 'src/tests/seeds/user-seeds';
import { TestApp } from 'src/tests/utils/test-app';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import {
  I_WEBINAR_REPOSITORY,
  IWebinarRepository,
} from 'src/webinars/ports/webinar-repository.interface';
import * as request from 'supertest';

describe('Feature: Organize webinar', () => {
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
          startDate: new Date('2021-01-01T00:00:00Z'),
          endDate: new Date('2021-01-01T01:00:00Z'),
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
    it('should change seats', async () => {
      const webinarId = 'webinar-id';
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/seats`)
        .set('Authorization', e2eUserSeeds.johnDoe.createAuthorizationToken())
        .send({
          seats: 100,
        });

      expect(result.status).toBe(200);

      const webinarRepository =
        app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
      const webinar = await webinarRepository.findById(webinarId);
      expect(webinar!.props.seats).toEqual(100);
    });
  });

  describe('Scenario: user not authenticated', () => {
    it('should reject', async () => {
      const webinarId = 'webinar-id';
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/seats`)
        .send({
          seats: 100,
        });

      expect(result.status).toBe(403);
    });
  });
});
