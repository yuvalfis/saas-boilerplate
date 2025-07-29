import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="w-full">
      <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl">
        <div className="px-8 py-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-400"
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
            <div>
              <h1 className="text-3xl font-bold text-dark-50">
                Create New Organization
              </h1>
              <p className="text-dark-300 mt-1">
                Set up a new organization to collaborate with your team
              </p>
            </div>
          </div>

          <div className="w-full max-w-3xl">
            <CreateOrganization
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
                  card: "w-full border-0 bg-transparent",
                  navbar: "hidden",
                  navbarMobileMenuButton: "hidden",
                  headerTitle: "text-dark-50 font-bold text-xl",
                  headerSubtitle: "text-dark-300",
                  formButtonPrimary: "btn-primary",
                  formFieldInput:
                    "bg-dark-800 border-dark-600 text-dark-50 focus:border-blue-500",
                  formFieldLabel: "text-dark-200 font-medium",
                  footerActionLink: "text-blue-400 hover:text-blue-300",
                },
              }}
              afterCreateOrganizationUrl="/dashboard/organizations"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
