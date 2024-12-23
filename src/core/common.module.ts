import { Module } from '@nestjs/common';
import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { RealDateGenerator } from 'src/core/adapters/real-date-generator';
import { RealIdGenerator } from 'src/core/adapters/real-id-generator';
import { I_DATE_GENERATOR } from 'src/core/ports/date-generator.interface';
import { I_ID_GENERATOR } from 'src/core/ports/id-generator.interface';
import { I_MAILER } from 'src/core/ports/mailer.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: I_DATE_GENERATOR,
      useClass: RealDateGenerator,
    },
    {
      provide: I_ID_GENERATOR,
      useClass: RealIdGenerator,
    },
    {
      provide: I_MAILER,
      useClass: InMemoryMailer,
    },
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR, I_MAILER],
})
export class CommonModule {}
