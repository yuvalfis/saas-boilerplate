import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserData } from '@saas-boilerplate/shared-lib';
import { AuthenticatedRequest } from '../guards/clerk-auth.guard';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    
    if (!request.user || !request.auth) {
      throw new Error('CurrentUser decorator requires ClerkAuthGuard');
    }

    return {
      user: request.user,
      organization: request.organization,
      auth: request.auth,
    };
  },
);