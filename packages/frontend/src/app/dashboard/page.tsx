import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserProfileExample } from "@/components/examples/user-profile-example";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* API Demo Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-4">API Integration Demo</h2>
        <p className="text-dark-300 mb-6">
          This demonstrates the authenticated API infrastructure fetching your user data from the backend:
        </p>
        <UserProfileExample />
      </div>

      <div className="glass-card p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-dark-50 mb-8">
            Welcome to your Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              href="/dashboard/organizations"
              className="glass-card p-6 hover:bg-dark-800/50 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-dark-50 mb-2">
                  Organizations
                </h2>
                <p className="text-dark-300">
                  Manage your organizations and memberships
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/create-organization"
              className="glass-card p-6 hover:bg-dark-800/50 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600/30 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-dark-50 mb-2">
                  Create Organization
                </h2>
                <p className="text-dark-300">Start a new organization</p>
              </div>
            </Link>

            <Link
              href="/dashboard/settings"
              className="glass-card p-6 hover:bg-dark-800/50 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-dark-50 mb-2">
                  Settings
                </h2>
                <p className="text-dark-300">Manage your account settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
