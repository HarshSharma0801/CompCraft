"use client";

import React, { useEffect } from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Component to sync user data after authentication
function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      console.log(
        "🔄 User detected, attempting to sync with database:",
        user.id
      );

      // Create or update user in our database
      const createUser = async () => {
        try {
          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress || "",
              firstName: user.firstName || "",
              lastName: user.lastName || "",
            }),
          });

          const data = await response.json();
          if (data.success) {
            console.log("✅ User synced successfully:", data.user.id);
          } else {
            console.error("❌ Failed to sync user:", data.error);
          }
        } catch (error) {
          console.error("❌ Error syncing user:", error);
        }
      };

      createUser();
    }
  }, [user, isLoaded]);

  return null;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (
    !publishableKey ||
    publishableKey === "disabled" ||
    publishableKey.includes("your_")
  ) {
    console.warn(
      "Clerk not configured properly. Running without authentication."
    );
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: "bg-black hover:bg-gray-800",
          footerActionLink: "text-black hover:text-gray-800",
        },
      }}
    >
      <UserSync />
      {children}
    </ClerkProvider>
  );
}
