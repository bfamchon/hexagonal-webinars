import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
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
    @Body()
    body: {
      title: string;
      seats: number;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.organizeWebinar.execute({
      user: new User({
        id: 'john-doe-id',
      }),
      title: body.title,
      seats: body.seats,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }
}
