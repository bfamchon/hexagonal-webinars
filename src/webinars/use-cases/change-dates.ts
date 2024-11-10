import { IDateGenerator } from 'src/core/ports/date-generator.interface';
import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { Webinar } from 'src/webinars/entities/webinar.entity';
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

  async execute(props: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(props.webinarId);
    if (!webinar) {
      throw new Error('Webinar not found');
    }
    if (webinar.props.organizerId !== props.user.props.id) {
      throw new Error('User is not allowed to update this webinar');
    }
    webinar.update({
      startDate: props.startDate,
      endDate: props.endDate,
    });

    if (webinar.isTooSoon(this.dateGenerator.now())) {
      throw new Error('Webinar dates are invalid');
    }
    await this.webinarRepository.update(webinar);

    await this.sendEmailToParticipants(webinar);
    return;
  }

  async sendEmailToParticipants(webinar: Webinar) {
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
