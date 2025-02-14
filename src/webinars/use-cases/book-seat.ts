import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IMailer } from 'src/core/ports/mailer.interface';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { Participation } from 'src/webinars/entities/participation.entity';
import { AlreadyParticipatingException } from 'src/webinars/exceptions/already-participating';
import { WebinarFullException } from 'src/webinars/exceptions/webinar-full';
import { WebinarNotFoundException } from 'src/webinars/exceptions/webinar-not-found';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { Webinar } from './../entities/webinar.entity';

type Request = {
  webinarId: string;
  user: User;
};
type Response = void;

export class BookSeatCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly webinarId: string,
  ) {}
}

@CommandHandler(BookSeatCommand)
export class BookSeatCommandHandler
  implements ICommandHandler<BookSeatCommand, Response>
{
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly webinarRepository: IWebinarRepository,
    private readonly mailer: IMailer,
  ) {}
  async execute({ webinarId, user }: BookSeatCommand): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFoundException();
    }

    const participants =
      await this.participationRepository.findByWebinarId(webinarId);

    await this.assertUserIsNotAlreadyParticipating({ user, participants });

    if (participants.length >= webinar.props.seats) {
      throw new WebinarFullException();
    }

    const participation = new Participation({
      userId: user.props.id,
      webinarId,
    });
    await this.participationRepository.save(participation);

    await this.sendEmailToOrganizer(webinar);
    await this.sendEmailToParticipant({
      participants,
      webinar,
    });
    return;
  }

  private async assertUserIsNotAlreadyParticipating({
    user,
    participants,
  }: {
    user: User;
    participants: Participation[];
  }) {
    const userParticipation =
      participants.find((p) => p.props.userId === user.props.id) ?? null;

    if (userParticipation?.props.userId === user.props.id) {
      throw new AlreadyParticipatingException();
    }
  }

  private async sendEmailToOrganizer(webinar: Webinar) {
    const organizer = await this.userRepository.findById(
      webinar.props.organizerId,
    );
    await this.mailer.send({
      to: organizer!.props.email,
      subject: 'New participant',
      body: `A seat in your webinar "${webinar.props.title}" has been booked`,
    });
  }

  private async sendEmailToParticipant({
    participants,
    webinar,
  }: {
    participants: Participation[];
    webinar: Webinar;
  }) {
    await Promise.all(
      participants.map(async (p) => {
        const participant = await this.userRepository.findById(p.props.userId);
        await this.mailer.send({
          to: participant!.props.email,
          subject: 'New participant',
          body: `A participant has joined the webinar "${webinar.props.title}"`,
        });
      }),
    );
  }
}
