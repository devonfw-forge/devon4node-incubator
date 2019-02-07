import { Config } from './types';

const production: Config = {
  isDev: false,
  host: 'localhost',
  port: 8080,
  jwtKey: '1q5cYpNHmjIwwfXBxnce3vAi1bfwy4KeM1dzpdSGvjuGkGDfjw9mml11aOkzC',
  swaggerConfig: {
    swaggerTitle: 'Production title',
    swaggerDescription: 'API Documentation Production',
    swaggerVersion: '0.0.1',
    swaggerBasepath: 'api',
  },
};

export default production;
