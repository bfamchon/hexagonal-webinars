import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { User } from 'src/users/entities/user.entity';
import { WebinarAPI } from 'src/webinars/contract';
import {
  GetWebinarByIdQuery,
  I_GET_WEBINAR_BY_ID_QUERY,
} from 'src/webinars/ports/get-webinar-by-id-query.interface';
import { CancelWebinar } from 'src/webinars/use-cases/cancel-webinar';
import { ChangeDates } from 'src/webinars/use-cases/change-dates';
import { ChangeSeats } from 'src/webinars/use-cases/change-seats';
import { OrganizeWebinars } from 'src/webinars/use-cases/organize-webinars';

@Controller()
export class WebinarController {
  constructor(
    private readonly organizeWebinar: OrganizeWebinars,
    private readonly changeSeats: ChangeSeats,
    private readonly changeDates: ChangeDates,
    private readonly cancelWebinar: CancelWebinar,
    @Inject(I_GET_WEBINAR_BY_ID_QUERY)
    private readonly getWebinarByIdQuery: GetWebinarByIdQuery,
  ) {}

  @Get('/webinars/:webinarId')
  async handleGetWebinar(
    @Param('webinarId') webinarId: string,
  ): Promise<WebinarAPI.GetWebinarById.Response> {
    return this.getWebinarByIdQuery.execute(webinarId);
  }

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

  @HttpCode(200)
  @Post('/webinars/:webinarId/dates')
  async handleChangeDates(
    @Param('webinarId') webinarId: string,
    @Body(new ZodValidationPipe(WebinarAPI.ChangeDates.schema))
    body: WebinarAPI.ChangeDates.Request,
    @Request() req: { user: User },
  ): Promise<WebinarAPI.ChangeDates.Response> {
    return this.changeDates.execute({
      user: req.user,
      webinarId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }

  @HttpCode(200)
  @Delete('/webinars/:webinarId')
  async handleCancel(
    @Param('webinarId') webinarId: string,
    @Request() req: { user: User },
  ): Promise<WebinarAPI.ChangeDates.Response> {
    return this.cancelWebinar.execute({
      user: req.user,
      webinarId,
    });
  }
}
