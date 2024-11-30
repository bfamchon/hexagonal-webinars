import * as path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
let instance: StartedDockerComposeEnvironment | null = null;

export const startDocker = async () => {
  console.log('Starting docker');
  const composeFilePath = path.resolve(__dirname);
  const composeFileName = 'docker-compose.yml';

  instance = await new DockerComposeEnvironment(
    composeFilePath,
    composeFileName,
  ).up();
};

export const stopDocker = async () => {
  console.log('Stopping docker');
  if (!instance) {
    return;
  }
  try {
    await instance.down();
  } catch (error) {
    console.error('Error stopping docker', error);
  }
};

export const getDockerInstance = () => {
  if (!instance) {
    throw new Error('Docker not started');
  }
  return instance;
};
