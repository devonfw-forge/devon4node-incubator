import { Config } from './types';

const def: Config = {
  isDev: true,
  host: 'localhost',
  port: 8081,
  jwtKey: '1q5cYpNHmjIwwfXBxnce3vAi1bfwy4KeM1dzpdSGvjuGkGDfjw9mml11aOkzC',
  swaggerConfig: {
    swaggerTitle: 'My Thai Star',
    swaggerDescription: 'API Documentation',
    swaggerVersion: '0.0.1',
    swaggerBasepath: '/mythaistar',
  },
};

export default def;
