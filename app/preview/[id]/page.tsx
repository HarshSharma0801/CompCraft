"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import ComponentEditor from "@/components/ComponentEditor";
import Navbar from "@/components/Navbar";

interface Component {
  id: string;
  title: string;
  code: string;
  description?: string;
  tags: string[];
}

interface PreviewPageProps {
  params: { id: string };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComponent();
  }, [params.id]);

  const fetchComponent = async () => {
    try {
      const response = await fetch(`/api/preview/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setComponent(data.component);
      } else {
        setError(data.error || "Component not found");
      }
    } catch (error) {
      console.error("Error fetching component:", error);
      setError("Failed to load component");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 border-r-purple-600 border-b-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Component not found"}
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar */}
      <Navbar
        showBackButton={true}
        backUrl="/"
        subtitle="Visual. Powerful. Instant."
      />

      {/* Preview Badge */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full font-medium">
                Public Preview
              </div>
            </div>
            <Link
              href="/editor"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </div>

      {/* Editor - Full height minus navbar and badge */}
      <div className="h-[calc(100vh-88px-48px)]">
        <ComponentEditor
          initialCode={component.code}
          readOnly={true}
          showSaveButton={false}
        />
      </div>
    </div>
  );
}
