import { User } from 'src/users/entities/user.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
type Request = {
  user: User;
  webinarId: string;
  seats: number;
};

type Response = void;

export class ChangeSeats {
  constructor(private readonly webinarRepository: IWebinarRepository) {}

  async execute(props: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(props.webinarId);
    if (!webinar) {
      throw new Error('Webinar not found');
    }
    if (webinar.props.organizerId !== props.user.props.id) {
      throw new Error('User is not allowed to update this webinar');
    }
    if (props.seats < webinar.props.seats) {
      throw new Error('You cannot reduce the number of seats');
    }
    webinar.update({ seats: props.seats });

    if (webinar.hasTooManySeats()) {
      throw new Error('Webinar must have at most 1000 seats');
    }
    await this.webinarRepository.update(webinar);

    return;
  }
}
