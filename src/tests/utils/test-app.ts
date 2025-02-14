import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/core/app.module';
import { IFixture } from 'src/tests/utils/fixture';
import { MongoUser } from 'src/users/adapters/mongo/mongo-user';
import { MongoParticipation } from 'src/webinars/adapters/mongo/mongo-participation';
import { MongoWebinar } from 'src/webinars/adapters/mongo/mongo-webinar';
export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          isGlobal: true,
          load: [
            () => ({
              DATABASE_URL:
                'mongodb://admin:azerty@localhost:3701/webinars?authSource=admin&directConnection=true',
            }),
          ],
        }),
      ],
    }).compile();
    this.app = module.createNestApplication();
    try {
      await this.app.init();
    } catch (error) {
      console.error(error);
    }
    await this.clearDatabase();
  }

  private async clearDatabase() {
    await this.app.get(getModelToken(MongoUser.CollectionName)).deleteMany({});
    await this.app
      .get(getModelToken(MongoWebinar.CollectionName))
      .deleteMany({});
    await this.app
      .get(getModelToken(MongoParticipation.CollectionName))
      .deleteMany({});
  }

  async cleanup() {
    await this.app.close();
  }

  get<T>(name: any) {
    return this.app.get<T>(name);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  loadFixtures(fixtures: IFixture[]) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }
}
