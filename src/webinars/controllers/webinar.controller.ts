import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { User } from 'src/users/entities/user.entity';
import { WebinarAPI } from 'src/webinars/contract';
import { ChangeSeats } from 'src/webinars/use-cases/change-seats';
import { OrganizeWebinars } from 'src/webinars/use-cases/organize-webinars';

@Controller()
export class WebinarController {
  constructor(
    private readonly organizeWebinar: OrganizeWebinars,
    private readonly changeSeats: ChangeSeats,
  ) {}

  @Post('/webinars')
  async handleOrganizeWebinar(
    @Body(new ZodValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    body: WebinarAPI.OrganizeWebinar.Request,
    @Request() req: { user: User },
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    return this.organizeWebinar.execute({
      user: req.user,
      title: body.title,
      seats: body.seats,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }

  @HttpCode(200)
  @Post('/webinars/:webinarId/seats')
  async handleChangeSeats(
    @Param('webinarId') webinarId: string,
    @Body(new ZodValidationPipe(WebinarAPI.ChangeSeats.schema))
    body: WebinarAPI.ChangeSeats.Request,
    @Request() req: { user: User },
  ): Promise<WebinarAPI.ChangeSeats.Response> {
    return this.changeSeats.execute({
      user: req.user,
      webinarId,
      seats: body.seats,
    });
  }
}
