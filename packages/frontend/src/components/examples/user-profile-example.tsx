'use client';

import { useCurrentUser } from '@/hooks/use-current-user';

export function UserProfileExample() {
  const { user, organization, isLoading, error, refetch } = useCurrentUser();

  if (isLoading) {
    return <div className="p-4 text-dark-300">Loading user profile...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-900/20 border border-red-800 rounded-lg">
        Error loading profile: {error.message}
        <button 
          onClick={() => refetch()}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-dark-500">No user data available</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-dark-900/80 backdrop-blur-sm rounded-lg shadow-2xl border border-dark-700">
      <div className="flex items-center space-x-4">
        {user.profileImageUrl && (
          <img 
            src={user.profileImageUrl} 
            alt="Profile" 
            className="w-16 h-16 rounded-full ring-2 ring-dark-600"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-dark-50">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-dark-300">{user.email}</p>
          <p className="text-sm text-dark-500">ID: {user.id}</p>
        </div>
      </div>
      
      {organization && (
        <div className="mt-4 pt-4 border-t border-dark-700">
          <h3 className="font-medium text-dark-50">Organization</h3>
          <div className="flex items-center space-x-2 mt-2">
            {organization.imageUrl && (
              <img 
                src={organization.imageUrl} 
                alt="Org" 
                className="w-8 h-8 rounded ring-1 ring-dark-600"
              />
            )}
            <div>
              <p className="font-medium text-dark-100">{organization.name}</p>
              {organization.slug && (
                <p className="text-sm text-dark-500">@{organization.slug}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => refetch()}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
      >
        Refresh Profile
      </button>
    </div>
  );
}