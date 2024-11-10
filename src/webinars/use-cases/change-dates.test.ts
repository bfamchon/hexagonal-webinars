import { FixedDateGenerator } from 'src/core/adapters/fixed-date-generator';
import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { IDateGenerator } from 'src/core/ports/date-generator.interface';
import { InMemoryUserRepository } from 'src/users/adapters/in-memory-user-repository';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { testUser } from 'src/users/tests/user-seeds';
import { InMemoryParticipationRepository } from 'src/webinars/adapters/in-memory-participation-repository';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/in-memory-webinar-repository';
import { Participation } from 'src/webinars/entities/participation.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { ChangeDates } from 'src/webinars/use-cases/change-dates';

describe('Feature: Change dates', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeDates;
  let dateGenerator: IDateGenerator;
  let participationRepository: IParticipationRepository;
  let mailer: InMemoryMailer;
  let userRepository: IUserRepository;
  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: 'alice-id',
    title: 'Webinar title',
    startDate: new Date('2024-01-10T09:00:00.000Z'),
    endDate: new Date('2024-01-10T10:00:00.000Z'),
    seats: 100,
  });
  const participation = new Participation({
    webinarId: webinar.props.id,
    userId: testUser.bob.props.id,
  });
  beforeEach(() => {
    dateGenerator = new FixedDateGenerator();
    mailer = new InMemoryMailer();
    participationRepository = new InMemoryParticipationRepository([
      participation,
    ]);
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    userRepository = new InMemoryUserRepository([testUser.bob]);
    useCase = new ChangeDates(
      webinarRepository,
      dateGenerator,
      participationRepository,
      userRepository,
      mailer,
    );
  });

  function expectWebinarDatesToRemainUnchanged() {
    const updatedWebinar = webinarRepository.findByIdSync('webinar-id');
    expect(updatedWebinar?.props.startDate).toEqual(
      new Date('2024-01-10T09:00:00.000Z'),
    );
    expect(updatedWebinar?.props.endDate).toEqual(
      new Date('2024-01-10T10:00:00.000Z'),
    );
  }
  describe('Scenario: Happy path', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      startDate: new Date('2024-01-10T07:00:00.000Z'),
      endDate: new Date('2024-01-10T08:00:00.000Z'),
    };
    it('should change the dates of a webinar', async () => {
      await useCase.execute(payload);
      const updatedWebinar = webinarRepository.findByIdSync('webinar-id');
      expect(updatedWebinar).toEqual(
        new Webinar({
          id: 'webinar-id',
          organizerId: 'alice-id',
          title: 'Webinar title',
          startDate: new Date('2024-01-10T07:00:00.000Z'),
          endDate: new Date('2024-01-10T08:00:00.000Z'),
          seats: 100,
        }),
      );
    });
    it('should send a mail to the participants', async () => {
      await useCase.execute(payload);
      expect(mailer.sentEmails).toEqual(
        expect.arrayContaining([
          {
            to: testUser.bob.props.email,
            subject: 'Webinar dates have changed',
            body: 'Webinar "Webinar title" has changed dates',
          },
        ]),
      );
    });
  });
  describe('Scenario: webinar does not exists', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'does-not-exist',
      startDate: new Date('2024-01-10T07:00:00.000Z'),
      endDate: new Date('2024-01-10T08:00:00.000Z'),
    };
    it('should throw an error and not update the webinar', async () => {
      expect(useCase.execute(payload)).rejects.toThrow(
        new Error('Webinar not found'),
      );

      expectWebinarDatesToRemainUnchanged();
    });
  });

  describe('Scenario: update the webinar too close to now', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      startDate: new Date('2024-01-02T07:00:00.000Z'),
      endDate: new Date('2024-01-02T08:00:00.000Z'),
    };
    it('should throw an error and not update the webinar', async () => {
      expect(useCase.execute(payload)).rejects.toThrow(
        new Error('Webinar dates are invalid'),
      );

      expectWebinarDatesToRemainUnchanged();
    });
  });
});
