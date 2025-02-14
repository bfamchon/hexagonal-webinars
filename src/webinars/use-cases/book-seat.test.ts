import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { InMemoryUserRepository } from 'src/users/adapters/in-memory-user-repository';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { testUser } from 'src/users/tests/user-seeds';
import { InMemoryParticipationRepository } from 'src/webinars/adapters/in-memory-participation-repository';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/in-memory-webinar-repository';
import { Participation } from 'src/webinars/entities/participation.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import {
  BookSeatCommand,
  BookSeatCommandHandler,
} from 'src/webinars/use-cases/book-seat';

describe('Feature: Book seat', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: BookSeatCommandHandler;
  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: 'alice-id',
    title: 'Webinar title',
    startDate: new Date('2024-01-10T09:00:00.000Z'),
    endDate: new Date('2024-01-10T10:00:00.000Z'),
    seats: 100,
  });
  const webinarFull = new Webinar({
    id: 'webinar-full-id',
    organizerId: 'alice-id',
    title: 'Webinar title',
    startDate: new Date('2024-01-10T09:00:00.000Z'),
    endDate: new Date('2024-01-10T10:00:00.000Z'),
    seats: 1,
  });
  let participationRepository: IParticipationRepository;
  let mailer: InMemoryMailer;
  let userRepository: IUserRepository;
  const charlesParticipationInFullWebinar = new Participation({
    webinarId: webinarFull.props.id,
    userId: testUser.charles.props.id,
  });
  const charlesParticipation = new Participation({
    webinarId: webinar.props.id,
    userId: testUser.charles.props.id,
  });

  beforeEach(() => {
    mailer = new InMemoryMailer();
    participationRepository = new InMemoryParticipationRepository([
      charlesParticipationInFullWebinar,
      charlesParticipation,
    ]);
    webinarRepository = new InMemoryWebinarRepository([webinar, webinarFull]);
    userRepository = new InMemoryUserRepository([
      testUser.alice,
      testUser.bob,
      testUser.charles,
    ]);

    useCase = new BookSeatCommandHandler(
      participationRepository,
      userRepository,
      webinarRepository,
      mailer,
    );
  });
  describe('Scenario: happy path', () => {
    const payload = new BookSeatCommand(testUser.bob, 'webinar-id');
    it('should book a seat', async () => {
      await useCase.execute(payload);
      const bobParticipation =
        await participationRepository.findByUserIdAndWebinarId({
          userId: testUser.bob.props.id,
          webinarId: 'webinar-id',
        });

      expect(bobParticipation).not.toBeNull();
    });

    it("should send an email to the webinar's organizer", async () => {
      await useCase.execute(payload);
      expect(mailer.sentEmails).toEqual(
        expect.arrayContaining([
          {
            to: testUser.alice.props.email,
            subject: 'New participant',
            body: 'A seat in your webinar "Webinar title" has been booked',
          },
        ]),
      );
    });

    it('should send an email to participants', async () => {
      await useCase.execute(payload);
      expect(mailer.sentEmails).toEqual(
        expect.arrayContaining([
          {
            to: 'charles@gmail.com',
            subject: 'New participant',
            body: 'A participant has joined the webinar "Webinar title"',
          },
        ]),
      );
    });
  });

  describe('Scenario: webinar does not exists', () => {
    const payload = new BookSeatCommand(testUser.bob, 'does-not-exist');

    it('should not book a seat but throw an error', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinar not found',
      );
      const bobParticipation =
        await participationRepository.findByUserIdAndWebinarId({
          userId: testUser.bob.props.id,
          webinarId: 'webinar-id',
        });
      expect(bobParticipation).toBeNull();
    });
  });

  describe('Scenario: webinar is full', () => {
    const payload = new BookSeatCommand(testUser.charles, 'webinar-id');

    it('should not book a seat but throw an error', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'You are already participating in this webinar',
      );
    });
  });

  describe('Scenario: webinar is full', () => {
    const payload = new BookSeatCommand(testUser.bob, 'webinar-full-id');

    it('should not book a seat but throw an error', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('Webinar is full');
      const bobParticipation =
        await participationRepository.findByUserIdAndWebinarId({
          userId: testUser.bob.props.id,
          webinarId: 'webinar-full-id',
        });
      expect(bobParticipation).toBeNull();
    });
  });
});
