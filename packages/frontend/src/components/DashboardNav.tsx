"use client";

import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Organizations", href: "/dashboard/organizations" },
  { name: "Settings", href: "/dashboard/settings" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-dark-900/80 backdrop-blur-sm border-b border-dark-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
                <h1 className="text-xl font-bold text-dark-50">
                  SaaS Boilerplate
                </h1>
              </div>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    pathname === item.href
                      ? "border-blue-500 text-dark-50 bg-blue-500/10"
                      : "border-transparent text-dark-300 hover:border-dark-500 hover:text-dark-100",
                    "inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium rounded-t-lg transition-all duration-200"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <OrganizationSwitcher
              appearance={{
                elements: {
                  organizationSwitcherTrigger:
                    "px-3 py-2 text-sm font-medium rounded-lg border border-dark-600 bg-dark-800 hover:bg-dark-700 text-dark-100 transition-all duration-200",
                  organizationSwitcherTriggerIcon: "text-dark-400",
                },
              }}
            />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "w-8 h-8 ring-2 ring-dark-600 hover:ring-blue-500 transition-all duration-200",
                  userButtonPopoverCard: "bg-dark-900 border border-dark-700",
                  userButtonPopoverActionButton:
                    "text-dark-200 hover:text-dark-50 hover:bg-dark-800",
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
