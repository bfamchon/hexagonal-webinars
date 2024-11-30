import { ParticipationFixture } from 'src/tests/fixtures/participation-fixture';
import { e2eUserSeeds } from 'src/tests/seeds/user-seeds';
import { e2eWebinarSeeds } from 'src/tests/seeds/webinar-seeds';
import { TestApp } from 'src/tests/utils/test-app';
import { Participation } from 'src/webinars/entities/participation.entity';
import {
  I_PARTICIPATION_REPOSITORY,
  IParticipationRepository,
} from 'src/webinars/ports/participation-repository.interface';
import * as request from 'supertest';

describe('Feature: Cancel seat', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    await app.loadFixtures([
      e2eUserSeeds.johnDoe,
      e2eUserSeeds.bob,
      e2eWebinarSeeds.webinar1,
      new ParticipationFixture(
        new Participation({
          userId: e2eUserSeeds.bob.entity.props.id,
          webinarId: e2eWebinarSeeds.webinar1.entity.props.id,
        }),
      ),
    ]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: happy path', () => {
    it('should cancel a seat', async () => {
      const webinarId = e2eWebinarSeeds.webinar1.entity.props.id;
      const result = await request(app.getHttpServer())
        .delete(`/webinars/${webinarId}/seats`)
        .set('Authorization', e2eUserSeeds.bob.createAuthorizationToken());

      expect(result.status).toBe(200);

      const participationRepository = app.get<IParticipationRepository>(
        I_PARTICIPATION_REPOSITORY,
      );
      const participation =
        await participationRepository.findByUserIdAndWebinarId({
          webinarId,
          userId: e2eUserSeeds.bob.entity.props.id,
        });
      expect(participation).toBeNull();
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
