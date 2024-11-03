import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { WebinarAPI } from 'src/app/contract';
import { User } from 'src/entities/user.entity';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { OrganizeWebinars } from 'src/usecases/organize-webinars';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly organizeWebinar: OrganizeWebinars,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

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
