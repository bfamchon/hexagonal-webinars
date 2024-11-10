import { IDateGenerator } from 'src/core/ports/date-generator.interface';
import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { WebinarDatesTooSoonException } from 'src/webinars/exceptions/webinar-dates-too-soon';
import { WebinarNotFoundException } from 'src/webinars/exceptions/webinar-not-found';
import { WebinarNotOrganizerException } from 'src/webinars/exceptions/webinar-not-organizer';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

type Request = {
  user: User;
  webinarId: string;
  startDate: Date;
  endDate: Date;
};

type Response = void;

export class ChangeDates implements Executable<Request, Response> {
  constructor(
    private readonly webinarRepository: IWebinarRepository,
    private readonly dateGenerator: IDateGenerator,
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({
    webinarId,
    user,
    startDate,
    endDate,
  }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFoundException();
    }
    if (!webinar.isOrganizer(user)) {
      throw new WebinarNotOrganizerException();
    }
    webinar.update({
      startDate,
      endDate,
    });

    if (webinar.isTooSoon(this.dateGenerator.now())) {
      throw new WebinarDatesTooSoonException();
    }
    await this.webinarRepository.update(webinar);

    await this.sendEmailToParticipants(webinar);
    return;
  }

  private async sendEmailToParticipants(webinar: Webinar) {
    const participants = await this.participationRepository.findByWebinarId(
      webinar.props.id,
    );

    const users = (await Promise.all(
      participants
        .map((participant) =>
          this.userRepository.findById(participant.props.userId),
        )
        .filter((user) => user !== null),
    )) as User[];

    await Promise.all(
      users.map((user) =>
        this.mailer.send({
          to: user.props.email,
          subject: 'Webinar dates have changed',
          body: `Webinar "${webinar.props.title}" has changed dates`,
        }),
      ),
    );
  }
}
