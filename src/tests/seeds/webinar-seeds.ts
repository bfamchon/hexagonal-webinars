import { addDays } from 'date-fns';
import { WebinarFixture } from 'src/tests/fixtures/webinar-fixture';
import { e2eUserSeeds } from 'src/tests/seeds/user-seeds';
import { Webinar } from 'src/webinars/entities/webinar.entity';

export const e2eWebinarSeeds = {
  webinar1: new WebinarFixture(
    new Webinar({
      id: 'webinar-id',
      title: 'Webinar title',
      startDate: addDays(new Date(), 2),
      endDate: addDays(new Date(), 2),
      seats: 50,
      organizerId: e2eUserSeeds.johnDoe.entity.props.id,
    }),
  ),
};
