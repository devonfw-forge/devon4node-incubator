import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';

@Module({
  providers: [ConfigurationService]
})
export class ConfigurationModule {}
