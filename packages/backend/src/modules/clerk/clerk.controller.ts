import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { EnhancedLoggerService } from '../logger/enhanced-logger.service';

@Controller('clerk')
export class ClerkController {
  private readonly context = 'ClerkController';

  constructor(
    private readonly clerkService: ClerkService,
    private readonly logger: EnhancedLoggerService
  ) {}

  @Post('webhook')
  async handleClerkWebhook(@Body() payload: any, @Headers() headers: any) {
    try {
      // Verify webhook signature
      const signature = headers['svix-signature'];
      const timestamp = headers['svix-timestamp'];
      const webhookId = headers['svix-id'];

      if (!signature || !timestamp || !webhookId) {
        throw new BadRequestException('Missing webhook signature headers');
      }

      // Process the webhook
      await this.clerkService.processClerkWebhook(payload, {
        signature,
        timestamp,
        webhookId,
      });

      return { success: true };
    } catch (error) {
      this.logger.logError('Webhook processing error', error, this.context);
      throw new BadRequestException('Webhook processing failed');
    }
  }
} 