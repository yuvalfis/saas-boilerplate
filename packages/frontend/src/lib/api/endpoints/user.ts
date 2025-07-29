import { UserProfileResponse, ProfileDataResponse } from '@saas-boilerplate/shared-lib';
import { apiClient } from '../client';

export const userApi = {
  // Get current user data
  getCurrentUser: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/api/users/me');
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<ProfileDataResponse> => {
    const response = await apiClient.get<ProfileDataResponse>('/api/users/profile');
    return response.data;
  },
};