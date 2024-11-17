import { e2eUserSeeds } from 'src/tests/seeds/user-seeds';
import { e2eWebinarSeeds } from 'src/tests/seeds/webinar-seeds';
import { TestApp } from 'src/tests/utils/test-app';
import {
  I_PARTICIPATION_REPOSITORY,
  IParticipationRepository,
} from 'src/webinars/ports/participation-repository.interface';
import * as request from 'supertest';

describe('Feature: Book a seat', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    await app.loadFixtures([
      e2eUserSeeds.johnDoe,
      e2eUserSeeds.bob,
      e2eWebinarSeeds.webinar1,
    ]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: happy path', () => {
    it('should book a seat', async () => {
      const webinarId = e2eWebinarSeeds.webinar1.entity.props.id;
      const result = await request(app.getHttpServer())
        .post(`/webinars/${webinarId}/bookings`)
        .set('Authorization', e2eUserSeeds.bob.createAuthorizationToken());

      expect(result.status).toBe(201);

      const participationRepository = app.get<IParticipationRepository>(
        I_PARTICIPATION_REPOSITORY,
      );
      const participation =
        await participationRepository.findByUserIdAndWebinarId({
          webinarId,
          userId: e2eUserSeeds.bob.entity.props.id,
        });
      expect(participation).not.toBeNull();
    });
  });

  describe('Scenario: user not authenticated', () => {
    it('should reject', async () => {
      const webinarId = 'webinar-id';
      const result = await request(app.getHttpServer()).post(
        `/webinars/${webinarId}/bookings`,
      );

      expect(result.status).toBe(403);
    });
  });
});
