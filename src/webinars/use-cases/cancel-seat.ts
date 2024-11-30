import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { ParticipationNotFoundException } from 'src/webinars/exceptions/participation-not-found';
import { WebinarNotFoundException } from 'src/webinars/exceptions/webinar-not-found';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

type Request = {
  webinarId: string;
  user: User;
};

type Response = void;

export class CancelSeat implements Executable<Request, Response> {
  constructor(
    private readonly webinarRepository: IWebinarRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({ webinarId, user }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new WebinarNotFoundException();
    }

    const participation =
      await this.participationRepository.findByUserIdAndWebinarId({
        userId: user.props.id,
        webinarId,
      });

    if (!participation) {
      throw new ParticipationNotFoundException();
    }

    await this.participationRepository.delete(participation);

    await this.sendEmailToParticipant({ participant: user, webinar });
    await this.sendEmailToOrganizer({ participant: user, webinar });
  }

  private async sendEmailToParticipant({
    participant,
    webinar,
  }: {
    participant: User;
    webinar: Webinar;
  }) {
    await this.mailer.send({
      to: participant.props.email,
      subject: 'Seat canceled',
      body: `You have canceled your seat for the webinar "${webinar.props.title}"`,
    });
  }

  private async sendEmailToOrganizer({
    participant,
    webinar,
  }: {
    participant: User;
    webinar: Webinar;
  }) {
    const organizer = await this.userRepository.findById(
      webinar.props.organizerId,
    );
    if (organizer) {
      await this.mailer.send({
        to: organizer.props.email,
        subject: 'Seat canceled',
        body: `User ${participant.props.email} has canceled their seat for the webinar "${webinar.props.title}"`,
      });
    }
  }
}
