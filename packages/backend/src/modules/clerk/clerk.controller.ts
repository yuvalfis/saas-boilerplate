import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Controller('clerk')
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}

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
      console.error('Webhook processing error:', error);
      throw new BadRequestException('Webhook processing failed');
    }
  }
} 