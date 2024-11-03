import { TestApp } from 'src/tests/utils/test-app';

export interface IFixture {
  load(app: TestApp): Promise<void>;
}
