"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Save, Code2, Settings, X } from "lucide-react";
import Link from "next/link";
import ComponentEditor from "@/components/ComponentEditor";
import Navbar from "@/components/Navbar";

export default function EditorPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [componentTitle, setComponentTitle] = useState("My Component");
  const [componentDescription, setComponentDescription] = useState(
    "Created in CompCraft editor"
  );
  const [componentTags, setComponentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Debug logging
  console.log("Editor page - User:", user?.id, "IsLoaded:", isLoaded);
  console.log("Show details button:", !!user);

  const addTag = () => {
    if (tagInput.trim() && !componentTags.includes(tagInput.trim())) {
      setComponentTags([...componentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setComponentTags(componentTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async (code: string) => {
    if (!user) {
      // Redirect to sign in if not authenticated
      router.push("/sign-in");
      return false;
    }

    setSaving(true);
    try {
      // Extract title from component code (simple heuristic)
      const titleMatch = code.match(/function\s+(\w+)|const\s+(\w+)\s*=/);
      const title = titleMatch?.[1] || titleMatch?.[2] || "Untitled Component";

      const response = await fetch("/api/component", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: componentTitle,
          code,
          description: componentDescription,
          tags: componentTags,
          isPublic: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the new component page
        router.push(`/component/${data.component.id}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar */}
      <Navbar subtitle="Visual. Powerful. Instant." />

      {/* Editor - Full height minus navbar */}
      <div className="h-[calc(100vh-88px)]">
        <ComponentEditor
          onSave={handleSave}
          saving={saving}
          showSaveButton={true} // Show save button in editor
          showDetailsButton={!!user} // Show details button if user is logged in
          onDetailsClick={() => setShowDetailsModal(true)} // Open details modal
        />
      </div>

      {/* Details Modal */}
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
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Details
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
