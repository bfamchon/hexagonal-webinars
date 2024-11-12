import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { InMemoryUserRepository } from 'src/users/adapters/in-memory-user-repository';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { testUser } from 'src/users/tests/user-seeds';
import { InMemoryParticipationRepository } from 'src/webinars/adapters/in-memory-participation-repository';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/in-memory-webinar-repository';
import { Participation } from 'src/webinars/entities/participation.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { CancelWebinar } from 'src/webinars/use-cases/cancel-webinar';

describe('Feature: Cancel webinar', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: CancelWebinar;
  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: 'alice-id',
    title: 'Webinar title',
    startDate: new Date('2024-01-10T09:00:00.000Z'),
    endDate: new Date('2024-01-10T10:00:00.000Z'),
    seats: 100,
  });
  let participationRepository: IParticipationRepository;
  let mailer: InMemoryMailer;
  let userRepository: IUserRepository;
  const participation = new Participation({
    webinarId: webinar.props.id,
    userId: testUser.bob.props.id,
  });

  beforeEach(() => {
    mailer = new InMemoryMailer();
    participationRepository = new InMemoryParticipationRepository([
      participation,
    ]);
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    userRepository = new InMemoryUserRepository([testUser.bob]);

    useCase = new CancelWebinar(
      webinarRepository,
      participationRepository,
      userRepository,
      mailer,
    );
  });

  function expectWebinarToRemainUnchanged() {
    const updatedWebinar = webinarRepository.findByIdSync('webinar-id');
    expect(updatedWebinar).not.toBeNull();
  }

  describe('Scenario: Happy path', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
    };
    it('should cancel a webinar', async () => {
      await useCase.execute(payload);
      const updatedWebinar = await webinarRepository.findById('webinar-id');
      expect(updatedWebinar).toBeNull();
    });

    it('should send an email to participants', async () => {
      await useCase.execute(payload);
      expect(mailer.sentEmails).toEqual(
        expect.arrayContaining([
          {
            to: testUser.bob.props.email,
            subject: 'Webinar canceled',
            body: 'The webinar "Webinar title" has been canceled',
          },
        ]),
      );
    });
  });

  describe('Scenario: webinar does not exist', () => {
    const payload = { user: testUser.alice, webinarId: 'does-not-exist' };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinar not found',
      );

      expectWebinarToRemainUnchanged();
    });
  });

  describe('Scenario: cancel the webinar of someone else', () => {
    const payload = { user: testUser.bob, webinarId: 'webinar-id' };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'User is not allowed to update this webinar',
      );

      expectWebinarToRemainUnchanged();
    });
  });
});
