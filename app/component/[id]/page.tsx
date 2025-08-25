"use client";

import React, { useState, useEffect, use } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Save, Code2, Settings, X } from "lucide-react";
import Link from "next/link";
import ComponentEditor from "@/components/ComponentEditor";
import Navbar from "@/components/Navbar";

interface Component {
  id: string;
  title: string;
  code: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ComponentPageProps {
  params: Promise<{ id: string }>;
}

export default function ComponentPage({ params }: ComponentPageProps) {
  const { id } = use(params);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [componentTitle, setComponentTitle] = useState("My Component");
  const [componentDescription, setComponentDescription] = useState(
    "Created in CompCraft editor"
  );
  const [componentTags, setComponentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Debug logging to match EditorPage
  console.log("Component page - User:", user?.id, "IsLoaded:", isLoaded);
  console.log("Show details button:", !!user);

  useEffect(() => {
    if (isLoaded) {
      fetchComponent();
    }
  }, [isLoaded, id]);

  const fetchComponent = async () => {
    try {
      const response = await fetch(`/api/component/${id}`);
      const data = await response.json();

      if (data.success) {
        setComponent(data.component);
        setComponentTitle(data.component.title);
        setComponentDescription(data.component.description || "");
        setComponentTags(data.component.tags || []);
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

  const handleSave = async (code: string) => {
    if (!user) {
      router.push("/sign-in");
      return false;
    }

    if (!component) return false;

    setSaving(true);
    try {
      const response = await fetch(`/api/component/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: componentTitle,
          code,
          description: componentDescription,
          tags: componentTags,
          isPublic: component.isPublic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComponent(data.component);
        return true;
      } else {
        console.error("Failed to save component:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error saving component:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !componentTags.includes(tagInput.trim())) {
      setComponentTags([...componentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setComponentTags(componentTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveDetails = async () => {
    if (!component || !user) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/component/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: componentTitle,
          description: componentDescription,
          tags: componentTags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComponent(data.component);
        setShowDetailsModal(false);
        // You could add a success notification here
      } else {
        console.error("Failed to save component details:", data.error);
        // You could add an error notification here
      }
    } catch (error) {
      console.error("Error saving component details:", error);
      // You could add an error notification here
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
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
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar - Aligned with EditorPage */}
      <Navbar subtitle="Visual. Powerful. Instant." />

      {/* Editor - Height calculation aligned with EditorPage */}
      <div className="h-[calc(100vh-88px)]">
        <ComponentEditor
          initialCode={component.code}
          onSave={handleSave}
          saving={saving}
          showSaveButton={true} // Aligned with EditorPage
          showDetailsButton={!!user} // Show details button if user is logged in
          onDetailsClick={() => setShowDetailsModal(true)} // Open details modal
        />
      </div>

      {/* Details Modal - Identical to EditorPage */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Component Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Component Title
                  </label>
                  <input
                    type="text"
                    value={componentTitle}
                    onChange={(e) => setComponentTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter component title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={componentDescription}
                    onChange={(e) => setComponentDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your component"
                    rows={3}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a tag"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {componentTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {componentTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDetails}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Details"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
