import { Test } from '@nestjs/testing';
import { addDays } from 'date-fns';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';

describe('Feature: Organize webinar', () => {
  it('should organize a webinar', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const result = await request(app.getHttpServer())
      .post('/webinars')
      .send({
        title: 'Webinar title',
        seats: 100,
        startDate: addDays(new Date(), 4).toISOString(),
        endDate: addDays(new Date(), 5).toISOString(),
      });

    expect(result.status).toBe(201);
    expect(result.body).toEqual({ id: expect.any(String) });
  });
});
