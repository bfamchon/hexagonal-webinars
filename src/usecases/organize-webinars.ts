type WebinarProps = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};

export class Webinar {
  constructor(public props: WebinarProps) {}
}

export interface IWebinarRepository {
  create(webinar: Webinar): Promise<void>;
}

export interface IIdGenerator {
  generate(): string;
}

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
