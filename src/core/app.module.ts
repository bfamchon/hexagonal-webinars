import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from 'src/core/app.controller';
import { AppService } from 'src/core/app.service';
import { AuthGuard } from 'src/core/auth.guard';
import { CommonModule } from 'src/core/common.module';
import { I_USER_REPOSITORY } from 'src/users/ports/user-repository.interface';
import { Authenticator } from 'src/users/services/authenticator';
import { UserModule } from 'src/users/users.module';
import { WebinarModule } from 'src/webinars/webinar.module';

@Module({
  imports: [CommonModule, WebinarModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Authenticator,
      inject: [I_USER_REPOSITORY],
      useFactory: (userRepository) => new Authenticator(userRepository),
    },
    {
      provide: APP_GUARD,
      inject: [Authenticator],
      useFactory: (authenticator) => new AuthGuard(authenticator),
    },
  ],
  exports: [],
})
export class AppModule {}