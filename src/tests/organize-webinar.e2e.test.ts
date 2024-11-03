import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { addDays } from 'date-fns';
import { InMemoryUserRepository } from 'src/adapters/in-memory-user-repository';
import { InMemoryWebinarRepository } from 'src/adapters/in-memory-webinar-repository';
import { User } from 'src/entities/user.entity';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';

describe('Feature: Organize webinar', () => {
  let app: INestApplication;
  const user = new User({
    id: 'john-doe-id',
    email: 'johndoe@gmail.com',
    password: 'azerty',
  });
  const token = Buffer.from(
    `${user.props.email}:${user.props.password}`,
  ).toString('base64');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    const userRepository = app.get(InMemoryUserRepository);
    await userRepository.create(user);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Scenario: happy path', () => {
    it('should create a webinar', async () => {
      const startDate = addDays(new Date(), 4);
      const endDate = addDays(new Date(), 5);
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .set('Authorization', `Basic ${token}`)
        .send({
          title: 'Webinar title',
          seats: 100,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(result.status).toBe(201);
      expect(result.body).toEqual({ id: expect.any(String) });

      const webinarRepository = app.get(InMemoryWebinarRepository);
      const webinar = await webinarRepository.database[0];

      expect(webinar.props).toEqual({
        id: result.body.id,
        organizerId: 'john-doe-id',
        title: 'Webinar title',
        startDate: startDate,
        endDate: endDate,
        seats: 100,
      });
    });
  });

  describe('Scenario: user not authenticated', () => {
    it('should reject', async () => {
      const result = await request(app.getHttpServer())
        .post('/webinars')
        .send({
          title: 'Webinar title',
          seats: 100,
          startDate: addDays(new Date(), 4).toISOString(),
          endDate: addDays(new Date(), 5).toISOString(),
        });

      expect(result.status).toBe(403);
    });
  });
});
