import { Config } from './types';

const test: Config = {
  isDev: false,
  host: 'localhost',
  port: 8080,
  jwtKey: 'key',
  swaggerConfig: {
    swaggerTitle: 'Your App Title',
    swaggerDescription: 'API Documentation',
    swaggerVersion: '0.0.1',
    swaggerBasepath: 'api',
  },
};

export default test;
