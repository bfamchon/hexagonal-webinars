import { Webinar } from 'src/entities/webinar.entity';
import { IWebinarRepository } from 'src/ports/webinar-repository.interface';

export class InMemoryWebinarRepository implements IWebinarRepository {
  public database: Webinar[] = [];

  findById(id: string): Promise<Webinar | null> {
    return Promise.resolve(
      this.database.find((webinar) => webinar.props.id === id) ?? null,
    );
  }
  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }
}
