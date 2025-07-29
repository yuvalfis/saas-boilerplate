// Current user data returned by @CurrentUser decorator
export interface CurrentUserData {
  user: {
    _id: string;
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  organization?: {
    _id: string;
    clerkId: string;
    name: string;
    slug?: string;
    imageUrl?: string;
  };
  auth: {
    userId: string;
    sessionId: string;
    orgId?: string;
  };
}

// API Response types for user endpoints
export interface UserProfileResponse {
  user: {
    id: string;
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  organization: {
    id: string;
    clerkId: string;
    name: string;
    slug?: string;
    imageUrl?: string;
  } | null;
}

export interface ProfileDataResponse {
  profile: {
    userId: string;
    email: string;
    fullName: string;
    organizationName: string | null;
  };
}