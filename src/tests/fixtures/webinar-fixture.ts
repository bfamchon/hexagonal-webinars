import { IFixture } from 'src/tests/utils/fixture';
import { TestApp } from 'src/tests/utils/test-app';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import {
  I_WEBINAR_REPOSITORY,
  IWebinarRepository,
} from 'src/webinars/ports/webinar-repository.interface';

export class WebinarFixture implements IFixture {
  constructor(public entity: Webinar) {}
  async load(app: TestApp): Promise<void> {
    const webinarRepository = app.get<IWebinarRepository>(I_WEBINAR_REPOSITORY);
    await webinarRepository.create(this.entity);
  }
}
