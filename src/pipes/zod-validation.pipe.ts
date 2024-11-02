import { BadRequestException, Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe {
  constructor(private readonly schema: z.Schema<any>) {}
  async transform(value) {
    const result = this.schema.safeParse(value);
    if (result.success) {
      return result;
    }
    throw new BadRequestException('Failed to validate');
  }
}
