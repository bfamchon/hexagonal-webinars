import { User } from 'src/users/entities/user.entity';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/in-memory-webinar-repository';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { ChangeSeats } from 'src/webinars/use-cases/change-seats';

describe('Change seats', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeSeats;
  const johnDoe = new User({
    id: 'john-doe-id',
    email: 'johndoe@gmail.com',
    password: 'azerty',
  });
  const hacker = new User({
    id: 'hacker-id',
    email: 'hacker@gmail.com',
    password: 'azerty',
  });
  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: 'john-doe-id',
    title: 'Webinar title',
    startDate: new Date('2022-01-01T00:00:00Z'),
    endDate: new Date('2022-01-01T01:00:00Z'),
    seats: 100,
  });
  async function expectWebinarToRemainUnchanged() {
    const webinar = await webinarRepository.findByIdSync('webinar-id');
    expect(webinar?.props.seats).toEqual(100);
  }
  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    useCase = new ChangeSeats(webinarRepository);
  });
  describe('Scenario: happy path', () => {
    it('should change the number of seats for a webinar', async () => {
      await useCase.execute({
        user: johnDoe,
        webinarId: 'webinar-id',
        seats: 200,
      });
      const updatedWebinar = await webinarRepository.findById('webinar-id');

      expect(updatedWebinar?.props.seats).toEqual(200);
    });
  });

  describe('Scenario: webinar does not exist', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: johnDoe,
          webinarId: 'does-not-exist',
          seats: 200,
        }),
      ).rejects.toThrow('Webinar not found');
      expectWebinarToRemainUnchanged();
    });
  });
  describe('Scenario: update the webinar of someone else', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: hacker,
          webinarId: 'webinar-id',
          seats: 200,
        }),
      ).rejects.toThrow('User is not allowed to update this webinar');
      expectWebinarToRemainUnchanged();
    });
  });

  describe('Scenario: change seat to an inferior number', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: johnDoe,
          webinarId: 'webinar-id',
          seats: 99,
        }),
      ).rejects.toThrow('You cannot reduce the number of seats');
      expectWebinarToRemainUnchanged();
    });
  });

  describe('Scenario: change seat to a number > 1000', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: johnDoe,
          webinarId: 'webinar-id',
          seats: 1001,
        }),
      ).rejects.toThrow('Webinar must have at most 1000 seats');
      expectWebinarToRemainUnchanged();
    });
  });
});
