import { IFixture } from 'src/tests/utils/fixture';
import { TestApp } from 'src/tests/utils/test-app';
import { Participation } from 'src/webinars/entities/participation.entity';
import {
  I_PARTICIPATION_REPOSITORY,
  IParticipationRepository,
} from 'src/webinars/ports/participation-repository.interface';

export class ParticipationFixture implements IFixture {
  constructor(public entity: Participation) {}
  async load(app: TestApp): Promise<void> {
    const participationRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );
    await participationRepository.save(this.entity);
  }
}
