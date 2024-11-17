import { Participation } from 'src/webinars/entities/participation.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(public readonly database: Participation[] = []) {}

  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    return this.database.filter((p) => p.props.webinarId === webinarId);
  }

  async findByUserIdAndWebinarId({
    userId,
    webinarId,
  }: {
    userId: string;
    webinarId: string;
  }): Promise<Participation | null> {
    return (
      this.database.find(
        (p) => p.props.userId === userId && p.props.webinarId === webinarId,
      ) ?? null
    );
  }

  async save(participation: Participation): Promise<void> {
    this.database.push(participation);
  }
}
