import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { InMemoryUserRepository } from 'src/users/adapters/in-memory-user-repository';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { testUser } from 'src/users/tests/user-seeds';
import { InMemoryParticipationRepository } from 'src/webinars/adapters/in-memory-participation-repository';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/in-memory-webinar-repository';
import { Participation } from 'src/webinars/entities/participation.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { CancelSeat } from 'src/webinars/use-cases/cancel-seat';

describe('Feature: Cancel Seat', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: CancelSeat;
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
    userRepository = new InMemoryUserRepository([testUser.bob, testUser.alice]);

    useCase = new CancelSeat(
      webinarRepository,
      participationRepository,
      userRepository,
      mailer,
    );
  });

  async function expectParticipationToNotBeDeleted(userId: string) {
    const bobParticipation =
      await participationRepository.findByUserIdAndWebinarId({
        userId,
        webinarId: webinar.props.id,
      });
    expect(bobParticipation).not.toBeNull();
  }
  describe('Scenario: happy path', () => {
    const payload = {
      webinarId: webinar.props.id,
      user: testUser.bob,
    };
    it('should cancel a seat', async () => {
      await useCase.execute(payload);
      const bobParticipation =
        await participationRepository.findByUserIdAndWebinarId({
          userId: testUser.bob.props.id,
          webinarId: webinar.props.id,
        });

      await expect(bobParticipation).toBeNull();
    });

    it('should send an email to the user', async () => {
      await useCase.execute(payload);
      const email = mailer.sentEmails.find(
        (e) => e.to === testUser.bob.props.email,
      );

      await expect(email).toEqual({
        to: testUser.bob.props.email,
        subject: 'Seat canceled',
        body: `You have canceled your seat for the webinar "${webinar.props.title}"`,
      });
    });

    it('should send an email to the organizer', async () => {
      await useCase.execute(payload);
      const email = mailer.sentEmails.find(
        (e) => e.to === testUser.alice.props.email,
      );

      await expect(email).toEqual({
        to: testUser.alice.props.email,
        subject: 'Seat canceled',
        body: `User ${testUser.bob.props.email} has canceled their seat for the webinar "${webinar.props.title}"`,
      });
    });
  });

  describe('Scenario: participation does not exist', () => {
    const payload = {
      webinarId: webinar.props.id,
      user: testUser.charles,
    };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'You are not participating in this webinar',
      );
    });
  });

  describe('Scenario: Webinar not found', () => {
    const payload = {
      webinarId: 'does-not-exist',
      user: testUser.bob,
    };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinar not found',
      );

      await expectParticipationToNotBeDeleted(testUser.bob.props.id);
    });
  });
});
