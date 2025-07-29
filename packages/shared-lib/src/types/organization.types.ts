// Organization types for internal data sync only
export interface IOrganization {
  _id: string;
  clerkId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  memberIds: string[];
  adminIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum OrganizationRole {
  ADMIN = "admin",
  MEMBER = "member",
}

export interface OrganizationMember {
  userId: string;
  role: OrganizationRole;
  joinedAt: Date;
}
