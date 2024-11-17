import { Participation } from 'src/webinars/entities/participation.entity';

export const I_PARTICIPATION_REPOSITORY = 'I_PARTICIPATION_REPOSITORY';
export interface IParticipationRepository {
  findByWebinarId(webinarId: string): Promise<Participation[]>;
  findByUserIdAndWebinarId({
    userId,
    webinarId,
  }: {
    userId: string;
    webinarId: string;
  }): Promise<Participation | null>;
  save(participation: Participation): Promise<void>;
}
