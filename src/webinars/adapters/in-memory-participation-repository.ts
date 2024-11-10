import { Participation } from 'src/webinars/entities/participation.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(public readonly database: Participation[] = []) {}

  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    return this.database.filter((p) => p.props.webinarId === webinarId);
  }
}
