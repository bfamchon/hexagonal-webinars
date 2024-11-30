import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/core/app.module';
import { IFixture } from 'src/tests/utils/fixture';

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
    await this.app.init();
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
