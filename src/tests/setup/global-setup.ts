import { startDocker } from './docker-manager';

const setup = async () => {
  console.log('Global setup');
  await startDocker();
};

export default setup;
