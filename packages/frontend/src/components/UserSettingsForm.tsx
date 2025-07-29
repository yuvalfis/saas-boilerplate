"use client";

import { UserProfile } from "@clerk/nextjs";

export function UserSettingsForm() {
  return (
    <UserProfile
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
          card: "w-full border-0 bg-transparent shadow-none",
          navbar: "hidden",
          navbarMobileMenuButton: "hidden",
          headerTitle: "text-dark-50 font-bold text-2xl",
          headerSubtitle: "text-dark-300",
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
          formFieldInput:
            "bg-dark-800 border-dark-600 text-dark-50 focus:border-blue-500",
          formFieldLabel: "text-dark-200 font-medium",
          profileSectionTitle: "text-dark-100 font-semibold text-lg",
          profileSectionContent: "text-dark-300",
          badge: "bg-blue-600/20 text-blue-400 border border-blue-600/30",
          identityPreviewText: "text-dark-200",
          identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
          footerActionLink: "text-blue-400 hover:text-blue-300",
        },
      }}
    />
  );
}
