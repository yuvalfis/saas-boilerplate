"use client";

import { OrganizationSwitcher as ClerkOrganizationSwitcher } from "@clerk/nextjs";

export function OrganizationSwitcher() {
  return (
    <ClerkOrganizationSwitcher
      appearance={{
        variables: {
          colorPrimary: "#2563eb",
          colorBackground: "#1e293b",
          colorInputBackground: "#1e293b",
          colorInputText: "#f8fafc",
          colorText: "#f8fafc",
          colorTextSecondary: "#cbd5e1",
          borderRadius: "0.75rem",
        },
        elements: {
          organizationSwitcherTrigger:
            "inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-dark-800 px-3 py-2 text-sm font-medium text-dark-100 border border-dark-600 hover:bg-dark-700 transition-all duration-200",
          organizationSwitcherTriggerIcon: "text-dark-400",
          organizationSwitcherPopover:
            "z-50 mt-2 w-64 origin-top-right rounded-xl bg-dark-900 border border-dark-700 shadow-2xl backdrop-blur-sm",
          organizationSwitcherPopoverCard: "bg-transparent border-0",
          organizationSwitcherPopoverActionButton:
            "text-dark-200 hover:text-dark-50 hover:bg-dark-800 rounded-lg transition-colors",
          organizationSwitcherPopoverActionButtonText: "text-dark-200",
          organizationSwitcherPopoverActionButtonIcon: "text-dark-400",
          organizationPreview: "text-dark-100",
          organizationPreviewMainIdentifier: "text-dark-50 font-medium",
          organizationPreviewSecondaryIdentifier: "text-dark-400",
          organizationSwitcherPreviewButton:
            "text-dark-200 hover:text-dark-50 hover:bg-dark-800 rounded-lg transition-colors",
        },
      }}
    />
  );
}
