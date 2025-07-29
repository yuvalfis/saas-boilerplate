import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { getDefaultLogger } from "./logger.factory";
import { EnhancedLoggerService } from "./enhanced-logger.service";

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDefaultLogger(configService),
    }),
  ],
  providers: [EnhancedLoggerService],
  exports: [EnhancedLoggerService],
})
export class LoggerModule {}
