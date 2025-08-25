"use client";

import React, { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Plus, Calendar, Eye, Lock, Unlock, Code2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Component {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    if (user) {
      fetchComponents();
    }
  }, [user, isLoaded, router]);

  const fetchComponents = async () => {
    try {
      const response = await fetch("/api/component");
      const data = await response.json();

      if (data.success) {
        setComponents(data.components);
      }
    } catch (error) {
      console.error("Error fetching components:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <Navbar subtitle="Visual. Powerful. Instant." />

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Components Grid */}
        {components.length === 0 ? (
          <div className="text-center py-12">
            <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No components yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first component to get started with CompCraft's visual
              crafting.
            </p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Component
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {components.map((component, index) => {
              const gradients = [
                "from-blue-500 to-purple-600",
                "from-purple-500 to-pink-600",
                "from-emerald-500 to-teal-600",
                "from-orange-500 to-red-600",
                "from-cyan-500 to-blue-600",
                "from-violet-500 to-purple-600",
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <Link
                  key={component.id}
                  href={`/component/${component.id}`}
                  className="group relative block"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300`}
                  ></div>
                  <div className="relative bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl p-6 hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3
                          className={`font-bold text-lg bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2 line-clamp-1`}
                        >
                          {component.title}
                        </h3>
                        {component.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {component.description}
                          </p>
                        )}
                      </div>
                      <div className="ml-3">
                        {component.isPublic ? (
                          <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                            <Unlock className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="p-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl">
                            <Lock className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {component.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {component.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`px-3 py-1 text-xs bg-gradient-to-r ${gradient} text-white font-medium rounded-full`}
                          >
                            {tag}
                          </span>
                        ))}
                        {component.tags.length > 3 && (
                          <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 font-medium rounded-full">
                            +{component.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(component.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-transparent bg-gradient-to-r ${gradient} bg-clip-text font-medium group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
