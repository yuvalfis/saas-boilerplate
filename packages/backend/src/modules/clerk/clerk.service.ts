import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserRepository } from "../user/db/user.repository";
import { OrganizationRepository } from "../organization/db/organization.repository";
import { EnhancedLoggerService } from "../logger/enhanced-logger.service";
import { Webhook } from "svix";

@Injectable()
export class ClerkService {
  private webhook: Webhook;
  private readonly context = 'ClerkService';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly logger: EnhancedLoggerService,
    private readonly configService: ConfigService
  ) {
    this.webhook = new Webhook(this.configService.get<string>('CLERK_WEBHOOK_SECRET') || "");
  }

  async processClerkWebhook(
    payload: any,
    headers: { signature: string; timestamp: string; webhookId: string }
  ) {
    try {
      // Verify the webhook signature
      const evt = this.webhook.verify(JSON.stringify(payload), {
        "svix-id": headers.webhookId,
        "svix-timestamp": headers.timestamp,
        "svix-signature": headers.signature,
      }) as any;

      const eventType = evt.type;
      const eventData = evt.data;

      switch (eventType) {
        case "user.created":
          await this.handleUserCreated(eventData);
          break;
        case "user.updated":
          await this.handleUserUpdated(eventData);
          break;
        case "user.deleted":
          await this.handleUserDeleted(eventData);
          break;
        case "organization.created":
          await this.handleOrganizationCreated(eventData);
          break;
        case "organization.updated":
          await this.handleOrganizationUpdated(eventData);
          break;
        case "organization.deleted":
          await this.handleOrganizationDeleted(eventData);
          break;
        case "organizationMembership.created":
          await this.handleOrganizationMembershipCreated(eventData);
          break;
        case "organizationMembership.updated":
          await this.handleOrganizationMembershipUpdated(eventData);
          break;
        case "organizationMembership.deleted":
          await this.handleOrganizationMembershipDeleted(eventData);
          break;
        case "organizationInvitation.created":
          await this.handleOrganizationInvitationCreated(eventData);
          break;
        case "organizationInvitation.accepted":
          await this.handleOrganizationInvitationAccepted(eventData);
          break;
        case "organizationInvitation.revoked":
          await this.handleOrganizationInvitationRevoked(eventData);
          break;
        default:
          // Unhandled webhook event type
      }

      // Webhook processed successfully
    } catch (error) {
      this.logger.logError(
        "Webhook verification or processing failed",
        error,
        this.context,
        {
          webhookId: headers.webhookId,
          eventType: payload?.type
        }
      );
      throw error;
    }
  }

  private async handleUserCreated(userData: any) {
    try {
      const existingUser = await this.userRepository.findByClerkId(userData.id);
      if (!existingUser) {
        await this.userRepository.create({
          clerkId: userData.id,
          email: userData.email_addresses[0]?.email_address,
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          profileImageUrl: userData.profile_image_url,
        });
      }
    } catch (error) {
      this.logger.logError("Error handling user created", error, this.context);
    }
  }

  private async handleUserUpdated(userData: any) {
    try {
      await this.userRepository.updateByClerkId(userData.id, {
        email: userData.email_addresses[0]?.email_address,
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        profileImageUrl: userData.profile_image_url,
      });
    } catch (error) {
      this.logger.logError("Error handling user updated", error, this.context);
    }
  }

  private async handleUserDeleted(userData: any) {
    try {
      const user = await this.userRepository.findByClerkId(userData.id);
      if (user) {
        await this.userRepository.delete((user as any)._id);
      }
    } catch (error) {
      this.logger.logError("Error handling user deleted", error, this.context);
    }
  }

  private async handleOrganizationCreated(orgData: any) {
    try {
      const existingOrg = await this.organizationRepository.findByClerkId(
        orgData.id
      );
      if (!existingOrg) {
        await this.organizationRepository.create({
          clerkId: orgData.id,
          name: orgData.name,
          slug: orgData.slug,
          logoUrl: orgData.logo_url,
          memberIds: [],
          adminIds: [],
        });
      }
    } catch (error) {
      this.logger.logError("Error handling organization created", error, this.context);
    }
  }

  private async handleOrganizationUpdated(orgData: any) {
    try {
      await this.organizationRepository.updateByClerkId(orgData.id, {
        name: orgData.name,
        slug: orgData.slug,
        logoUrl: orgData.logo_url,
      });
    } catch (error) {
      this.logger.logError("Error handling organization updated", error, this.context);
    }
  }

  private async handleOrganizationDeleted(orgData: any) {
    try {
      const organization = await this.organizationRepository.findByClerkId(
        orgData.id
      );
      if (organization) {
        await this.organizationRepository.delete((organization as any)._id);
      }
    } catch (error) {
      this.logger.logError("Error handling organization deleted", error, this.context);
    }
  }

  private async handleOrganizationMembershipCreated(membershipData: any) {
    try {

      const user = await this.userRepository.findByClerkId(
        membershipData.public_user_data.user_id
      );
      const organization = await this.organizationRepository.findByClerkId(
        membershipData.organization.id
      );

      if (!user) {
        this.logger.error(
          `User not found for membership creation: ${membershipData.public_user_data.user_id}`,
          null,
          this.context
        );
        throw new Error(
          `User with Clerk ID ${membershipData.public_user_data.user_id} not found`
        );
      }

      if (!organization) {
        this.logger.error(
          `Organization not found for membership creation: ${membershipData.organization.id}`,
          null,
          this.context
        );
        throw new Error(
          `Organization with Clerk ID ${membershipData.organization.id} not found`
        );
      }

      // Check if user is already a member to prevent duplicates
      const existingOrg = await this.organizationRepository.findById(
        (organization as any)._id
      );
      const isAlreadyMember = existingOrg?.memberIds?.some(
        (memberId) => memberId.toString() === (user as any)._id.toString()
      );

      if (!isAlreadyMember) {
        // Add user to organization
        await this.organizationRepository.addMember(
          (organization as any)._id,
          (user as any)._id
        );
      }

      // Update user's organization list
      const userOrgs = await this.userRepository.findById((user as any)._id);
      const isInUserOrgs = userOrgs?.organizationIds?.some(
        (orgId) => orgId.toString() === (organization as any)._id.toString()
      );

      if (!isInUserOrgs) {
        await this.userRepository.addToOrganization(
          (user as any)._id,
          (organization as any)._id
        );
      }

      // Handle admin role
      if (
        membershipData.role === "admin" ||
        membershipData.role === "org:admin"
      ) {
        const isAlreadyAdmin = existingOrg?.adminIds?.some(
          (adminId) => adminId.toString() === (user as any)._id.toString()
        );

        if (!isAlreadyAdmin) {
          await this.organizationRepository.addAdmin(
            (organization as any)._id,
            (user as any)._id
          );
        }
      }

    } catch (error) {
      this.logger.logError(
        "Error handling organization membership created",
        error,
        this.context,
        { membershipData }
      );
      throw error;
    }
  }

  private async handleOrganizationMembershipUpdated(membershipData: any) {
    try {

      const user = await this.userRepository.findByClerkId(
        membershipData.public_user_data.user_id
      );
      const organization = await this.organizationRepository.findByClerkId(
        membershipData.organization.id
      );

      if (!user) {
        this.logger.error(
          `User not found for membership update: ${membershipData.public_user_data.user_id}`,
          null,
          this.context
        );
        throw new Error(
          `User with Clerk ID ${membershipData.public_user_data.user_id} not found`
        );
      }

      if (!organization) {
        this.logger.error(
          `Organization not found for membership update: ${membershipData.organization.id}`,
          null,
          this.context
        );
        throw new Error(
          `Organization with Clerk ID ${membershipData.organization.id} not found`
        );
      }

      // Ensure user is a member first (in case membership creation was missed)
      const existingOrg = await this.organizationRepository.findById(
        (organization as any)._id
      );
      const isAlreadyMember = existingOrg?.memberIds?.some(
        (memberId) => memberId.toString() === (user as any)._id.toString()
      );

      if (!isAlreadyMember) {
        await this.organizationRepository.addMember(
          (organization as any)._id,
          (user as any)._id
        );
        await this.userRepository.addToOrganization(
          (user as any)._id,
          (organization as any)._id
        );
      }

      // Update admin status based on role
      const isCurrentlyAdmin = existingOrg?.adminIds?.some(
        (adminId) => adminId.toString() === (user as any)._id.toString()
      );

      if (
        membershipData.role === "admin" ||
        membershipData.role === "org:admin"
      ) {
        // User should be admin
        if (!isCurrentlyAdmin) {
          await this.organizationRepository.addAdmin(
            (organization as any)._id,
            (user as any)._id
          );
        }
      } else {
        // User should not be admin (member or other role)
        if (isCurrentlyAdmin) {
          await this.organizationRepository.removeAdmin(
            (organization as any)._id,
            (user as any)._id
          );
        }
      }

    } catch (error) {
      this.logger.logError(
        "Error handling organization membership updated",
        error,
        this.context,
        { membershipData }
      );
      throw error;
    }
  }

  private async handleOrganizationMembershipDeleted(membershipData: any) {
    try {

      const user = await this.userRepository.findByClerkId(
        membershipData.public_user_data.user_id
      );
      const organization = await this.organizationRepository.findByClerkId(
        membershipData.organization.id
      );

      if (!user) {
        this.logger.warn(
          `User not found for membership deletion (may have been deleted): ${membershipData.public_user_data.user_id}`,
          this.context
        );
        return;
      }

      if (!organization) {
        this.logger.warn(
          `Organization not found for membership deletion (may have been deleted): ${membershipData.organization.id}`,
          this.context
        );
        return;
      }

      // Remove user from organization (this also removes admin status)
      await this.organizationRepository.removeMember(
        (organization as any)._id,
        (user as any)._id
      );

      // Remove organization from user's list
      await this.userRepository.removeFromOrganization(
        (user as any)._id,
        (organization as any)._id
      );

    } catch (error) {
      this.logger.logError(
        "Error handling organization membership deleted",
        error,
        this.context,
        { membershipData }
      );
      throw error;
    }
  }

  private async handleOrganizationInvitationCreated(invitationData: any) {
    try {

      // For invitation created, we just log it for tracking purposes
      // The actual membership will be created when the invitation is accepted
    } catch (error) {
      this.logger.logError(
        "Error handling organization invitation created",
        error,
        this.context,
        { invitationData }
      );
      throw error;
    }
  }

  private async handleOrganizationInvitationAccepted(invitationData: any) {
    try {

      // When an invitation is accepted, a organizationMembership.created event should also be triggered
      // So we primarily log this for tracking, but don't duplicate membership creation logic
    } catch (error) {
      this.logger.logError(
        "Error handling organization invitation accepted",
        error,
        this.context,
        { invitationData }
      );
      throw error;
    }
  }

  private async handleOrganizationInvitationRevoked(invitationData: any) {
    try {

      // For invitation revoked, we just log it for tracking purposes
      // No membership changes needed since the invitation was never accepted
    } catch (error) {
      this.logger.logError(
        "Error handling organization invitation revoked",
        error,
        this.context,
        { invitationData }
      );
      throw error;
    }
  }
}
