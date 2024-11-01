import {
  IIdGenerator,
  IWebinarRepository,
  OrganizeWebinars,
  Webinar,
} from 'src/usecases/organize-webinars';

describe('Feature: Organize webinars', () => {
  it('should create a webinar', async () => {
    class WebinarRepository implements IWebinarRepository {
      public database: Webinar[] = [];
      async create(webinar: Webinar): Promise<void> {
        this.database.push(webinar);
      }
    }

    class FixedIdGenerator implements IIdGenerator {
      generate() {
        return 'id-1';
      }
    }

    const repository = new WebinarRepository();
    const idGenerator = new FixedIdGenerator();
    const useCase = new OrganizeWebinars(repository, idGenerator);
    const result = await useCase.execute({
      title: 'Webinar title',
      seats: 100,
      startDate: new Date('2024-01-01T10:00:00.000Z'),
      endDate: new Date('2024-01-01T11:00:00.000Z'),
    });

    expect(repository.database).toEqual(
      expect.arrayContaining([
        {
          props: {
            id: 'id-1',
            title: 'Webinar title',
            startDate: new Date('2024-01-01T10:00:00.000Z'),
            endDate: new Date('2024-01-01T11:00:00.000Z'),
            seats: 100,
          },
        },
      ]),
    );
  });
});
