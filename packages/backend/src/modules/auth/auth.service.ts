import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/db/user.repository';
import { OrganizationRepository } from '../organization/db/organization.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async getUserById(clerkId: string) {
    return this.userRepository.findByClerkId(clerkId);
  }

  async getOrganizationById(clerkId: string) {
    return this.organizationRepository.findByClerkId(clerkId);
  }
}