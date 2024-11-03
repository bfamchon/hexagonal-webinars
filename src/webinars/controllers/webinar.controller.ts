import { Body, Controller, Post, Request } from '@nestjs/common';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { User } from 'src/users/entities/user.entity';
import { WebinarAPI } from 'src/webinars/contract';
import { OrganizeWebinars } from 'src/webinars/use-cases/organize-webinars';

@Controller()
export class WebinarController {
  constructor(private readonly organizeWebinar: OrganizeWebinars) {}

  @Post('/webinars')
  async handleOrganizeWebinar(
    @Body(new ZodValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    body: WebinarAPI.OrganizeWebinar.Request,
    @Request() req: { user: User },
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    console;
    return this.organizeWebinar.execute({
      user: req.user,
      title: body.title,
      seats: body.seats,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }
}
