import { Webinar } from 'src/entities/webinar.entity';
import { IIdGenerator } from 'src/ports/id-generator.interface';
import { IWebinarRepository } from 'src/ports/webinar-repository.interface';

export class OrganizeWebinars {
  constructor(
    private readonly webinarRepository: IWebinarRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(data: {
    title: string;
    seats: number;
    startDate: Date;
    endDate: Date;
  }) {
    const id = this.idGenerator.generate();
    await this.webinarRepository.create(
      new Webinar({
        id,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        seats: data.seats,
      }),
    );

    return { id };
  }
}
