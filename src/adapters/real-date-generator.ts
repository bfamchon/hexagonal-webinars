import { IDateGenerator } from 'src/ports/date-generator.interface';

export class RealDateGenerator implements IDateGenerator {
  now(): Date {
    return new Date();
  }
}
