import { IDateGenerator } from 'src/core/ports/date-generator.interface';
import { IIdGenerator } from 'src/core/ports/id-generator.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

type Request = {
  user: User;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

type Response = { id: string };

export class OrganizeWebinars implements Executable<Request, Response> {
  constructor(
    private readonly webinarRepository: IWebinarRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  async execute(data: Request) {
    const id = this.idGenerator.generate();

    const webinar = new Webinar({
      id,
      organizerId: data.user.props.id,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      seats: data.seats,
    });
    if (webinar.isTooSoon(this.dateGenerator.now())) {
      throw new Error('Webinar must be scheduled at least 3 days in advance');
    }
    if (webinar.hasTooManySeats()) {
      throw new Error('Webinar must have at most 1000 seats');
    }

    if (webinar.hasNotEnoughSeats()) {
      throw new Error('Webinar must have at least 1 seat');
    }

    await this.webinarRepository.create(webinar);

    return { id };
  }
}
