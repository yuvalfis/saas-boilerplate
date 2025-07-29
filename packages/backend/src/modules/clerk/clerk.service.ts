import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user/db/user.repository";
import { OrganizationRepository } from "../organization/db/organization.repository";
import { Webhook } from "svix";

@Injectable()
export class ClerkService {
  private webhook: Webhook;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository
  ) {
    this.webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
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
          console.log("Unhandled webhook event type:", eventType);
      }

      console.log("Webhook processed successfully:", {
        eventType,
        webhookId: headers.webhookId,
      });
    } catch (error) {
      console.error("Webhook verification or processing failed:", {
        error: error.message,
        webhookId: headers.webhookId,
        eventType: payload?.type,
        stack: error.stack,
      });
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
      console.log("User created/synced:", userData.id);
    } catch (error) {
      console.error("Error handling user created:", error);
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
      console.log("User updated:", userData.id);
    } catch (error) {
      console.error("Error handling user updated:", error);
    }
  }

  private async handleUserDeleted(userData: any) {
    try {
      const user = await this.userRepository.findByClerkId(userData.id);
      if (user) {
        await this.userRepository.delete((user as any)._id);
      }
      console.log("User deleted:", userData.id);
    } catch (error) {
      console.error("Error handling user deleted:", error);
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
      console.log("Organization created/synced:", orgData.id);
    } catch (error) {
      console.error("Error handling organization created:", error);
    }
  }

  private async handleOrganizationUpdated(orgData: any) {
    try {
      await this.organizationRepository.updateByClerkId(orgData.id, {
        name: orgData.name,
        slug: orgData.slug,
        logoUrl: orgData.logo_url,
      });
      console.log("Organization updated:", orgData.id);
    } catch (error) {
      console.error("Error handling organization updated:", error);
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
      console.log("Organization deleted:", orgData.id);
    } catch (error) {
      console.error("Error handling organization deleted:", error);
    }
  }

  private async handleOrganizationMembershipCreated(membershipData: any) {
    try {
      console.log("Processing organizationMembership.created:", {
        membershipId: membershipData.id,
        userId: membershipData.public_user_data?.user_id,
        organizationId: membershipData.organization?.id,
        role: membershipData.role,
      });

      const user = await this.userRepository.findByClerkId(
        membershipData.public_user_data.user_id
      );
      const organization = await this.organizationRepository.findByClerkId(
        membershipData.organization.id
      );

      if (!user) {
        console.error(
          "User not found for membership creation:",
          membershipData.public_user_data.user_id
        );
        throw new Error(
          `User with Clerk ID ${membershipData.public_user_data.user_id} not found`
        );
      }

      if (!organization) {
        console.error(
          "Organization not found for membership creation:",
          membershipData.organization.id
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
        console.log("Added user to organization members:", {
          userId: (user as any)._id,
          organizationId: (organization as any)._id,
        });
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
        console.log("Added organization to user's organization list:", {
          userId: (user as any)._id,
          organizationId: (organization as any)._id,
        });
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
          console.log("Added user as admin:", {
            userId: (user as any)._id,
            organizationId: (organization as any)._id,
          });
        }
      }

      console.log(
        "Organization membership created successfully:",
        membershipData.id
      );
    } catch (error) {
      console.error("Error handling organization membership created:", {
        error: error.message,
        membershipData,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async handleOrganizationMembershipUpdated(membershipData: any) {
    try {
      console.log("Processing organizationMembership.updated:", {
        membershipId: membershipData.id,
        userId: membershipData.public_user_data?.user_id,
        organizationId: membershipData.organization?.id,
        role: membershipData.role,
      });

      const user = await this.userRepository.findByClerkId(
        membershipData.public_user_data.user_id
      );
      const organization = await this.organizationRepository.findByClerkId(
        membershipData.organization.id
      );

      if (!user) {
        console.error(
          "User not found for membership update:",
          membershipData.public_user_data.user_id
        );
        throw new Error(
          `User with Clerk ID ${membershipData.public_user_data.user_id} not found`
        );
      }

      if (!organization) {
        console.error(
          "Organization not found for membership update:",
          membershipData.organization.id
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
        console.log("Added user as member during update (was missing):", {
          userId: (user as any)._id,
          organizationId: (organization as any)._id,
        });
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
          console.log("Promoted user to admin:", {
            userId: (user as any)._id,
            organizationId: (organization as any)._id,
          });
        }
      } else {
        // User should not be admin (member or other role)
        if (isCurrentlyAdmin) {
          await this.organizationRepository.removeAdmin(
            (organization as any)._id,
            (user as any)._id
          );
          console.log("Demoted user from admin:", {
            userId: (user as any)._id,
            organizationId: (organization as any)._id,
          });
        }
      }

      console.log(
        "Organization membership updated successfully:",
        membershipData.id
      );
    } catch (error) {
      console.error("Error handling organization membership updated:", {
        error: error.message,
        membershipData,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async handleOrganizationMembershipDeleted(membershipData: any) {
    try {
      console.log("Processing organizationMembership.deleted:", {
        membershipId: membershipData.id,
        userId: membershipData.public_user_data?.user_id,
        organizationId: membershipData.organization?.id,
      });

      const user = await this.userRepository.findByClerkId(
        membershipData.public_user_data.user_id
      );
      const organization = await this.organizationRepository.findByClerkId(
        membershipData.organization.id
      );

      if (!user) {
        console.warn(
          "User not found for membership deletion (may have been deleted):",
          membershipData.public_user_data.user_id
        );
        return;
      }

      if (!organization) {
        console.warn(
          "Organization not found for membership deletion (may have been deleted):",
          membershipData.organization.id
        );
        return;
      }

      // Remove user from organization (this also removes admin status)
      await this.organizationRepository.removeMember(
        (organization as any)._id,
        (user as any)._id
      );
      console.log("Removed user from organization:", {
        userId: (user as any)._id,
        organizationId: (organization as any)._id,
      });

      // Remove organization from user's list
      await this.userRepository.removeFromOrganization(
        (user as any)._id,
        (organization as any)._id
      );
      console.log("Removed organization from user's list:", {
        userId: (user as any)._id,
        organizationId: (organization as any)._id,
      });

      console.log(
        "Organization membership deleted successfully:",
        membershipData.id
      );
    } catch (error) {
      console.error("Error handling organization membership deleted:", {
        error: error.message,
        membershipData,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async handleOrganizationInvitationCreated(invitationData: any) {
    try {
      console.log("Processing organizationInvitation.created:", {
        invitationId: invitationData.id,
        emailAddress: invitationData.email_address,
        organizationId: invitationData.organization?.id,
        role: invitationData.role,
      });

      // For invitation created, we just log it for tracking purposes
      // The actual membership will be created when the invitation is accepted
      console.log(
        "Organization invitation created successfully:",
        invitationData.id
      );
    } catch (error) {
      console.error("Error handling organization invitation created:", {
        error: error.message,
        invitationData,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async handleOrganizationInvitationAccepted(invitationData: any) {
    try {
      console.log("Processing organizationInvitation.accepted:", {
        invitationId: invitationData.id,
        emailAddress: invitationData.email_address,
        organizationId: invitationData.organization?.id,
        role: invitationData.role,
      });

      // When an invitation is accepted, a organizationMembership.created event should also be triggered
      // So we primarily log this for tracking, but don't duplicate membership creation logic
      console.log(
        "Organization invitation accepted successfully:",
        invitationData.id
      );
    } catch (error) {
      console.error("Error handling organization invitation accepted:", {
        error: error.message,
        invitationData,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async handleOrganizationInvitationRevoked(invitationData: any) {
    try {
      console.log("Processing organizationInvitation.revoked:", {
        invitationId: invitationData.id,
        emailAddress: invitationData.email_address,
        organizationId: invitationData.organization?.id,
      });

      // For invitation revoked, we just log it for tracking purposes
      // No membership changes needed since the invitation was never accepted
      console.log(
        "Organization invitation revoked successfully:",
        invitationData.id
      );
    } catch (error) {
      console.error("Error handling organization invitation revoked:", {
        error: error.message,
        invitationData,
        stack: error.stack,
      });
      throw error;
    }
  }
}
