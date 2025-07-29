import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SaaS Boilerplate",
  description: "A modern SaaS boilerplate with Clerk authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2563eb",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
          colorInputText: "#f8fafc",
          colorText: "#f8fafc",
          colorTextSecondary: "#cbd5e1",
          colorNeutral: "#64748b",
          colorDanger: "#ef4444",
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          borderRadius: "0.75rem",
          fontFamily: inter.style.fontFamily,
        },
        elements: {
          // Card and container elements
          card: "bg-dark-900/50 backdrop-blur-sm border border-dark-700/50 rounded-xl shadow-2xl",
          rootBox: "w-full",

          // Header elements
          headerTitle: "text-dark-50 font-bold text-2xl",
          headerSubtitle: "text-dark-300",

          // Form elements
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
          formButtonSecondary:
            "bg-dark-800 hover:bg-dark-700 text-dark-100 border border-dark-600 font-medium py-2 px-4 rounded-lg transition-all duration-200",
          formFieldInput:
            "bg-dark-800 border-dark-600 text-dark-50 focus:border-blue-500 focus:ring-blue-500/20",
          formFieldLabel: "text-dark-200 font-medium",
          formFieldHintText: "text-dark-400",
          formFieldSuccessText: "text-green-400",
          formFieldErrorText: "text-red-400",
          formFieldWarningText: "text-yellow-400",

          // Social buttons
          socialButtonsBlockButton:
            "bg-dark-800 hover:bg-dark-700 text-dark-100 border border-dark-600 transition-all duration-200",
          socialButtonsBlockButtonText: "text-dark-100",
          socialButtonsBlockButtonIcon: "text-dark-400",

          // Profile elements
          profileSectionTitle: "text-dark-100 font-semibold text-lg",
          profileSectionContent: "text-dark-300",
          profileSectionPrimaryButton:
            "bg-blue-600 hover:bg-blue-700 text-white",

          // Identity elements
          identityPreviewText: "text-dark-200",
          identityPreviewEditButton: "text-blue-400 hover:text-blue-300",

          // Navigation elements
          navbar: "bg-dark-900/80 backdrop-blur-sm border-b border-dark-700",
          navbarButton: "text-dark-200 hover:text-dark-50",
          navbarMobileMenuButton: "text-dark-200",

          // Badge elements
          badge: "bg-blue-600/20 text-blue-400 border border-blue-600/30",

          // Footer elements
          footerActionLink: "text-blue-400 hover:text-blue-300",
          footerActionText: "text-dark-300",

          // Organization elements
          organizationSwitcherTrigger:
            "bg-dark-800 hover:bg-dark-700 text-dark-100 border border-dark-600 transition-all duration-200",
          organizationSwitcherTriggerIcon: "text-dark-400",
          organizationSwitcherPopover:
            "bg-dark-900 border border-dark-700 shadow-2xl backdrop-blur-sm",
          organizationPreview: "text-dark-100",
          organizationPreviewMainIdentifier: "text-dark-50 font-medium",
          organizationPreviewSecondaryIdentifier: "text-dark-400",

          // User button elements
          userButtonPopoverCard:
            "bg-dark-900 border border-dark-700 shadow-2xl",
          userButtonPopoverActionButton:
            "text-dark-200 hover:text-dark-50 hover:bg-dark-800 transition-colors",
          userButtonPopoverActionButtonText: "text-dark-200",
          userButtonPopoverActionButtonIcon: "text-dark-400",
          userButtonPopoverFooter: "border-t border-dark-700",

          // Alert elements
          alertText: "text-dark-300",
          alertTitle: "text-dark-50 font-semibold",

          // Divider elements
          dividerLine: "border-dark-700",
          dividerText: "text-dark-400",

          // Loading elements
          spinner: "text-blue-500",

          // Modal elements
          modalContent: "bg-dark-900 border border-dark-700",
          modalCloseButton: "text-dark-400 hover:text-dark-200",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
