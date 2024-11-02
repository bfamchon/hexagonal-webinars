import { Webinar } from 'src/entities/webinar.entity';
import { IWebinarRepository } from 'src/ports/webinar-repository.interface';

export class InMemoryWebinarRepository implements IWebinarRepository {
  public database: Webinar[] = [];
  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }
}
