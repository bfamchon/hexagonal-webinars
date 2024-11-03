import { TestApp } from 'src/tests/test-app';

export interface IFixture {
  load(app: TestApp): Promise<void>;
}
