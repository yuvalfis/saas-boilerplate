import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { EnhancedLoggerService } from '../../logger/enhanced-logger.service';
import { createClerkClient } from '@clerk/clerk-sdk-node';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
    orgId?: string;
  };
  user?: any;
  organization?: any;
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerkClient;
  private readonly context = 'ClerkAuthGuard';

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly logger: EnhancedLoggerService,
  ) {
    this.clerkClient = createClerkClient({
      secretKey: this.configService.get('CLERK_SECRET_KEY'),
      publishableKey: this.configService.get('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Verify the Clerk JWT token using the official SDK with issuer
      const verified = await this.clerkClient.verifyToken(token, {
        issuer: this.configService.get('CLERK_JWT_ISSUER'),
      });

      if (!verified || !verified.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // Set auth info on request
      request.auth = {
        userId: verified.sub,
        sessionId: verified.sid || '',
        orgId: verified.org_id,
      };

      // Fetch user from database
      const user = await this.authService.getUserById(verified.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      request.user = user;

      // Fetch organization if orgId is present
      if (verified.org_id) {
        const organization = await this.authService.getOrganizationById(verified.org_id);
        if (organization) {
          request.organization = organization;
        }
      }

      return true;
    } catch (error) {
      this.logger.logError('Token verification failed', error, this.context);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}