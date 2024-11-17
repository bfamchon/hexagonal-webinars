import { Controller, Param, Post, Request } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { WebinarAPI } from 'src/webinars/contract';
import { BookSeat } from 'src/webinars/use-cases/book-seat';

@Controller()
export class ParticipationController {
  constructor(private readonly bookSeat: BookSeat) {}

  @Post('/webinars/:webinarId/bookings')
  async handleBookSeat(
    @Param('webinarId') webinarId: string,
    @Request() req: { user: User },
  ): Promise<WebinarAPI.BookSeat.Response> {
    return this.bookSeat.execute({
      user: req.user,
      webinarId,
    });
  }
}
