import { UserProfile } from "@clerk/nextjs";

export default function Settings() {
  return (
    <div className="w-full">
      <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl">
        <div className="px-8 py-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-400"
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
            <div>
              <h1 className="text-3xl font-bold text-dark-50">
                Account Settings
              </h1>
              <p className="text-dark-300 mt-1">
                Manage your profile and account preferences
              </p>
            </div>
          </div>

          <div className="w-full [&>div]:w-full [&>div>div]:w-full">
            <UserProfile
              routing="hash"
              appearance={{
                variables: {
                  colorPrimary: "#2563eb",
                  colorBackground: "transparent",
                  colorInputBackground: "#1e293b",
                  colorInputText: "#f8fafc",
                  colorText: "#f8fafc",
                  colorTextSecondary: "#cbd5e1",
                  borderRadius: "0.75rem",
                },
                elements: {
                  card: "w-full !max-w-none border-0 bg-transparent",
                  rootBox: "w-full",
                  pageScrollBox: "w-full",
                  navbar: "hidden",
                  navbarMobileMenuButton: "hidden",
                  headerTitle: "text-dark-50 font-bold text-2xl",
                  headerSubtitle: "text-dark-300",
                  formButtonPrimary: "btn-primary",
                  formFieldInput:
                    "bg-dark-800 border-dark-600 text-dark-50 focus:border-blue-500",
                  formFieldLabel: "text-dark-200 font-medium",
                  profileSectionTitle: "text-dark-100 font-semibold text-lg",
                  profileSectionContent: "text-dark-300",
                  badge:
                    "bg-blue-600/20 text-blue-400 border border-blue-600/30",
                  identityPreviewText: "text-dark-200",
                  identityPreviewEditButton:
                    "text-blue-400 hover:text-blue-300",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
