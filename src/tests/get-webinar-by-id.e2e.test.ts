import { e2eUserSeeds } from 'src/tests/seeds/user-seeds';
import { e2eWebinarSeeds } from 'src/tests/seeds/webinar-seeds';
import { TestApp } from 'src/tests/utils/test-app';
import * as request from 'supertest';

describe('Feature: Get a webinar by id', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    await app.loadFixtures([e2eUserSeeds.johnDoe, e2eWebinarSeeds.webinar1]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: happy path', () => {
    it('should get a webinar', async () => {
      const webinar = e2eWebinarSeeds.webinar1.entity;
      const webinarId = webinar.props.id;
      const result = await request(app.getHttpServer())
        .get(`/webinars/${webinarId}`)
        .set('Authorization', e2eUserSeeds.johnDoe.createAuthorizationToken());

      expect(result.status).toBe(200);

      expect(result.body).toEqual({
        id: webinarId,
        title: 'Webinar title',
        startDate: webinar.props.startDate.toISOString(),
        endDate: webinar.props.endDate.toISOString(),
        seats: {
          available: 50,
          reserved: 0,
        },
        organizer: {
          id: e2eUserSeeds.johnDoe.entity.props.id,
          emailAddress: e2eUserSeeds.johnDoe.entity.props.email,
        },
      });
    });
  });

  describe('Scenario: user not authenticated', () => {
    it('should reject', async () => {
      const webinarId = 'webinar-id';
      const result = await request(app.getHttpServer()).get(
        `/webinars/${webinarId}`,
      );

      expect(result.status).toBe(403);
    });
  });
});
