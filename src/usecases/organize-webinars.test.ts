import { FixedIdGenerator } from 'src/adapters/fixed-id-generator';
import { InMemoryWebinarRepository } from 'src/adapters/in-memory-webinar-repository';
import { Webinar } from 'src/entities/webinar.entity';
import { OrganizeWebinars } from 'src/usecases/organize-webinars';

describe('Feature: Organize webinars', () => {
  let repository: InMemoryWebinarRepository;
  let idGenerator: FixedIdGenerator;
  let useCase: OrganizeWebinars;
  const payload = {
    title: 'Webinar title',
    seats: 100,
    startDate: new Date('2024-01-01T10:00:00.000Z'),
    endDate: new Date('2024-01-01T11:00:00.000Z'),
  };

  function expectWebinarToEqual(webinar: Webinar) {
    expect(webinar).toEqual({
      props: {
        id: 'id-1',
        title: 'Webinar title',
        startDate: new Date('2024-01-01T10:00:00.000Z'),
        endDate: new Date('2024-01-01T11:00:00.000Z'),
        seats: 100,
      },
    });
  }

  beforeEach(() => {
    repository = new InMemoryWebinarRepository();
    idGenerator = new FixedIdGenerator();
    useCase = new OrganizeWebinars(repository, idGenerator);
  });

  describe('Scenario: happy path', () => {
    it('should create a webinar', async () => {
      const result = await useCase.execute(payload);

      expect(result).toEqual({ id: 'id-1' });
    });

    it('should insert a new webinar in the repository', async () => {
      await useCase.execute(payload);

      const createdWebinar = repository.database[0];
      expectWebinarToEqual(createdWebinar);
    });
  });
});
