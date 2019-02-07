export interface Config {
  isDev: boolean;
  host: string;
  port: number;
  jwtKey: string;
  swaggerConfig: SwaggerConfig;
}

export interface SwaggerConfig {
  swaggerTitle: string;
  swaggerDescription: string;
  swaggerVersion: string;
  swaggerBasepath: string;
}
