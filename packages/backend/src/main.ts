import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { EnhancedLoggerService } from './modules/logger/enhanced-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get services
  const logger = app.get(EnhancedLoggerService);
  const configService = app.get(ConfigService);
  
  // Use custom logger for the application
  app.useLogger(logger);

  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  
  logger.log(`Backend server started successfully on port ${port}`, 'Bootstrap');
  logger.log(`CORS enabled for origin: ${frontendUrl}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
}); 