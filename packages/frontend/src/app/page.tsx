import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-dark-50 mb-4">
            SaaS Boilerplate
          </h1>
          <p className="text-lg text-dark-300 mb-8 leading-relaxed">
            A modern, professional SaaS application with organization
            management, built with Next.js, NestJS, and MongoDB.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-dark-100 font-semibold">
                  Secure Authentication
                </h3>
                <p className="text-dark-400 text-sm">Powered by Clerk</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-400"
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
              <div>
                <h3 className="text-dark-100 font-semibold">
                  Organization Management
                </h3>
                <p className="text-dark-400 text-sm">Multi-tenant ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="space-y-4">
          <SignInButton mode="modal">
            <button className="w-full btn-primary text-center">
              Sign In to Your Account
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="w-full btn-secondary text-center">
              Create New Account
            </button>
          </SignUpButton>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-dark-700/50">
          <p className="text-dark-400 text-sm">
            Built with Next.js, NestJS, MongoDB & Clerk
          </p>
        </div>
      </div>
    </div>
  );
}
