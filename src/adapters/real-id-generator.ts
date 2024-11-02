import { IIdGenerator } from 'src/ports/id-generator.interface';
import { v4 as uuidV4 } from 'uuid';

export class RealIdGenerator implements IIdGenerator {
  generate() {
    return uuidV4();
  }
}