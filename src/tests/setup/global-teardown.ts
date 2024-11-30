import { stopDocker } from './docker-manager';

const teardown = async () => {
  console.log('Global teardown');
  await stopDocker();
};

export default teardown;
