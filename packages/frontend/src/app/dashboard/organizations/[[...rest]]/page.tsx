"use client";

import { OrganizationProfile, useOrganization } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import Link from "next/link";
import { useState } from "react";

export default function Organizations() {
  const { isLoaded, organization } = useOrganization();
  const [showProfile, setShowProfile] = useState(false);

  if (!isLoaded) {
    return (
      <div className="w-full">
        <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl">
          <div className="px-8 py-10">
            <div className="animate-pulse">
              <div className="h-8 bg-dark-700 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-dark-700 rounded w-full"></div>
                <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                <div className="h-4 bg-dark-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-400"
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
                <h1 className="text-3xl font-bold text-dark-50">
                  Organization Management
                </h1>
                <p className="text-dark-300 mt-1">
                  Manage your organizations and team settings
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/create-organization"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
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
              <span>Create Organization</span>
            </Link>
          </div>
        </div>
      </div>

      {organization ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Organization Info */}
          <div className="lg:col-span-1">
            <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-dark-50 mb-4">
                Current Organization
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {organization.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-50">
                      {organization.name}
                    </h3>
                    <p className="text-sm text-dark-400">
                      Organization ID: {organization.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-700/50">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-300">Members</span>
                      <span className="text-dark-50 font-medium">
                        {organization.membersCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Created</span>
                      <span className="text-dark-50 font-medium">
                        {new Date(organization.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="w-full btn-secondary text-left flex items-center justify-between"
                  >
                    <span>Manage Organization</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showProfile ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div className="bg-dark-800/50 border border-dark-700/50 rounded-lg p-3">
                    <p className="text-sm text-dark-300 mb-2">
                      Switch Organization
                    </p>
                    <OrganizationSwitcher />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Management */}
          <div className="lg:col-span-2">
            {showProfile ? (
              <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-dark-50">
                    Organization Settings
                  </h2>
                  <p className="text-dark-300 mt-1">
                    Manage members, roles, and organization details
                  </p>
                </div>
                <div className="w-full">
                  <OrganizationProfile
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
                        rootBox: "w-full !overflow-clip",
                        pageScrollBox: "w-full !overflow-clip",
                        organizationProfileScrollBox: "!overflow-clip",
                        navbar: "hidden",
                        navbarMobileMenuButton: "hidden",
                        headerTitle: "text-dark-50 font-bold text-2xl",
                        headerSubtitle: "text-dark-300",
                        formButtonPrimary: "btn-primary",
                        formFieldInput:
                          "bg-dark-800 border-dark-600 text-dark-50 focus:border-blue-500",
                        formFieldLabel: "text-dark-200 font-medium",
                        profileSectionTitle:
                          "text-dark-100 font-semibold text-lg",
                        profileSectionContent: "text-dark-300 overflow-none",
                        badge:
                          "bg-blue-600/20 text-blue-400 border border-blue-600/30",
                        identityPreviewText: "text-dark-200",
                        identityPreviewEditButton:
                          "text-blue-400 hover:text-blue-300",
                        scrollBox: "overflow-clip",
                        scrollBoxContent: "overflow-clip",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-400"
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
                  <h3 className="text-xl font-semibold text-dark-50 mb-2">
                    Organization Dashboard
                  </h3>
                  <p className="text-dark-300 mb-6">
                    Welcome to {organization.name}. Click "Manage Organization"
                    to access settings, invite members, and configure your
                    organization.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                    <div className="bg-dark-800/30 border border-dark-700/50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
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
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-medium text-dark-50 text-sm">
                        Team Members
                      </h4>
                      <p className="text-dark-400 text-xs">
                        Invite and manage team members
                      </p>
                    </div>

                    <div className="bg-dark-800/30 border border-dark-700/50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-4 h-4 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-medium text-dark-50 text-sm">
                        Permissions
                      </h4>
                      <p className="text-dark-400 text-xs">
                        Configure roles and permissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-dark-900/30 backdrop-blur-sm border border-dark-700/30 rounded-xl p-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-dark-800/50 rounded-2xl flex items-center justify-center mb-6 border border-dark-700/50">
              <svg
                className="w-12 h-12 text-dark-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-dark-50 mb-3">
              No Organization Selected
            </h3>
            <p className="text-dark-300 mb-8 max-w-md mx-auto leading-relaxed">
              You need to select or create an organization to manage its
              settings and members.
            </p>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-dark-800/50 border border-dark-700/50 rounded-lg p-4">
                  <OrganizationSwitcher />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <div className="h-px bg-dark-700 flex-1 max-w-20"></div>
                <span className="text-dark-400 text-sm">or</span>
                <div className="h-px bg-dark-700 flex-1 max-w-20"></div>
              </div>

              <Link
                href="/dashboard/create-organization"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
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
                <span>Create New Organization</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
