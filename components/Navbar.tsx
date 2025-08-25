"use client";

import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { ArrowLeft, Save, Code2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  subtitle?: string;
  showAuthButtons?: boolean;
  variant?: "light" | "dark";
}

export default function Navbar({
  showBackButton = false,
  backUrl = "/",
  title = "CompCraft",
  subtitle,
  showAuthButtons = true,
  variant = "light",
}: NavbarProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const bgClasses =
    variant === "light"
      ? "bg-white/90 backdrop-blur-xl border-white/20"
      : "bg-gray-900/90 backdrop-blur-xl border-gray-700/50";

  const textClasses = variant === "light" ? "text-gray-900" : "text-white";

  const buttonClasses =
    variant === "light"
      ? "text-gray-700 hover:bg-white/50 border-gray-300"
      : "text-gray-300 hover:bg-gray-800/50 border-gray-600";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
      // The redirectUrl should handle the redirect, but we'll add a fallback
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback redirect in case of error
      window.location.href = "/";
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className={`relative ${bgClasses} border-b shadow-lg`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="flex cursor-pointer items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1
                  className={`text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ${textClasses}`}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p className={`text-sm ${variant === "light" ? "text-gray-600" : "text-gray-300"}`}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {showAuthButtons && isLoaded && (
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-6 py-2.5 border rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${buttonClasses}`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={`flex items-center gap-2 px-6 py-2.5 border rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${buttonClasses} ${isSigningOut ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <LogOut className="w-4 h-4" />
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className={`px-6 py-2.5 border rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${buttonClasses}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}