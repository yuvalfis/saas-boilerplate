import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUserData, UserProfileResponse, ProfileDataResponse } from '@saas-boilerplate/shared-lib';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  @Get('me')
  async getCurrentUser(@CurrentUser() currentUser: CurrentUserData): Promise<UserProfileResponse> {
    return {
      user: {
        id: currentUser.user._id,
        clerkId: currentUser.user.clerkId,
        email: currentUser.user.email,
        firstName: currentUser.user.firstName,
        lastName: currentUser.user.lastName,
        profileImageUrl: currentUser.user.profileImageUrl,
      },
      organization: currentUser.organization ? {
        id: currentUser.organization._id,
        clerkId: currentUser.organization.clerkId,
        name: currentUser.organization.name,
        slug: currentUser.organization.slug,
        imageUrl: currentUser.organization.imageUrl,
      } : null,
    };
  }

  @Get('profile')
  async getProfile(@CurrentUser() currentUser: CurrentUserData): Promise<ProfileDataResponse> {
    return {
      profile: {
        userId: currentUser.user._id,
        email: currentUser.user.email,
        fullName: `${currentUser.user.firstName || ''} ${currentUser.user.lastName || ''}`.trim(),
        organizationName: currentUser.organization?.name || null,
      },
    };
  }
}