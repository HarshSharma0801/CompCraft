"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import {
  Play,
  Save,
  Users,
  Zap,
  Sparkles,
  Rocket,
  Star,
  Code2,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { user, isLoaded } = useUser();

  // User is logged in - stay on landing page with logged-in status
  if (isLoaded && user) {
    console.log("User is logged in:", user.id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navbar */}
      <Navbar subtitle="Visual. Powerful. Instant." />

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-8">
            <Star className="w-4 h-4 text-yellow-500" />
            Revolutionary Visual Development
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>

          {/* Main Heading */}
          <h2 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              CompCraft
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
              Visual Editor
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Craft beautiful React components with our revolutionary visual
            editor.
            <span className="block mt-2 text-lg text-purple-600 font-medium">
              Click, edit, and ship — all in real-time ⚡
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/editor"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 text-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Rocket className="w-6 h-6 group-hover:animate-bounce" />
              Launch Editor
              <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </div>
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 font-bold rounded-2xl hover:bg-white hover:border-purple-300 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
              >
                <Save className="w-6 h-6" />
                My Components
              </Link>
            )}
          </div>

          {/* Stats or Social Proof */}
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Zero Configuration
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Real-time Preview
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              Cloud Sync
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-75"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4 text-center">
                Paste & Craft
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Simply paste your React component code and start crafting
                visually.
                <span className="block mt-2 text-blue-600 font-medium">
                  Zero setup required ✨
                </span>
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 text-center">
                Real-time Crafting
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                See your changes instantly. Click on any element to craft text,
                colors, fonts, and more.
                <span className="block mt-2 text-purple-600 font-medium">
                  Lightning fast ⚡
                </span>
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-75"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 text-center">
                Save & Showcase
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Save your crafted components to the cloud and showcase them to
                your team.
                <span className="block mt-2 text-emerald-600 font-medium">
                  {!user ? "Sign up to unlock! 🚀" : "Team collaboration 🤝"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!user && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl"></div>
            <div className="relative text-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-white/50 rounded-3xl p-12 backdrop-blur-sm">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full text-sm font-medium text-purple-700 mb-4">
                  <Sparkles className="w-4 h-4" />
                  Limited Time
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-4">
                  Ready to craft like a pro?
                </h3>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who are already crafting faster
                  with CompCraft's visual editor.
                  <span className="block mt-2 text-purple-600 font-semibold">
                    Start free, upgrade when you're ready! 🚀
                  </span>
                </p>
              </div>
              <Link
                href="/sign-up"
                className="group relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 text-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                Get Started Free
                <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
