import { IDateGenerator } from 'src/core/ports/date-generator.interface';
import { IIdGenerator } from 'src/core/ports/id-generator.interface';
import { User } from 'src/users/entities/user.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

export class OrganizeWebinars {
  constructor(
    private readonly webinarRepository: IWebinarRepository,
    private readonly idGenerator: IIdGenerator,
    private readonly dateGenerator: IDateGenerator,
  ) {}

  async execute(data: {
    user: User;
    title: string;
    seats: number;
    startDate: Date;
    endDate: Date;
  }) {
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
