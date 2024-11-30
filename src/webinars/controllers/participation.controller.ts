import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { WebinarAPI } from 'src/webinars/contract';
import { BookSeat } from 'src/webinars/use-cases/book-seat';
import { CancelSeat } from 'src/webinars/use-cases/cancel-seat';

@Controller()
export class ParticipationController {
  constructor(
    private readonly bookSeat: BookSeat,
    private readonly cancelSeat: CancelSeat,
  ) {}

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

  @HttpCode(200)
  @Delete('/webinars/:webinarId/seats')
  async handleCancelSeat(
    @Param('webinarId') webinarId: string,
    @Request() req: { user: User },
  ): Promise<void> {
    return this.cancelSeat.execute({
      user: req.user,
      webinarId,
    });
  }
}
