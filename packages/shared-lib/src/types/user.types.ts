// User types for internal data sync only
export interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  organizationIds: string[];
  currentOrganizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
