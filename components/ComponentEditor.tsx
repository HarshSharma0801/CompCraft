"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, Save, Settings } from "lucide-react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import PropertyPanel from "./PropertyPanel";
import { parseComponent, updateComponentCode } from "@/lib/codeParser";
import { SelectedElement } from "@/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const defaultCode = `function Card() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to CompCraft
        </h2>
        <p className="text-gray-600 mb-4">
          Click on any element to craft its properties. You can change text content, colors, font size, and font weight.
        </p>
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
          Try Crafting!
        </button>
      </div>
    </div>
  )
}`;

interface ComponentEditorProps {
  initialCode?: string;
  onSave?: (code: string, metadata?: any) => Promise<boolean>;
  saving?: boolean;
  readOnly?: boolean;
  showSaveButton?: boolean;
  showDetailsButton?: boolean;
  onDetailsClick?: () => void;
}

export default function ComponentEditor({
  initialCode = defaultCode,
  onSave,
  saving = false,
  readOnly = false,
  showSaveButton = true,
  showDetailsButton = false,
  onDetailsClick,
}: ComponentEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [previewCode, setPreviewCode] = useState(initialCode);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedComponent, setParsedComponent] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update when initialCode changes
  useEffect(() => {
    setCode(initialCode);
    setPreviewCode(initialCode);
    setHasUnsavedChanges(false);
  }, [initialCode]);

  useEffect(() => {
    try {
      const parsed = parseComponent(previewCode);
      setParsedComponent(parsed);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to parse component"
      );
      setParsedComponent(null);
    }
  }, [previewCode]);

  const handlePropertyChange = (property: string, value: string) => {
    if (!selectedElement) return;

    try {
      const updatedCode = updateComponentCode(
        previewCode,
        selectedElement,
        property,
        value
      );
      setPreviewCode(updatedCode);
      setCode(updatedCode);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to update code:", err);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setHasUnsavedChanges(newCode !== previewCode);
  };

  const handleSave = async () => {
    if (onSave) {
      const success = await onSave(code);
      if (success) {
        setPreviewCode(code);
        setHasUnsavedChanges(false);
        setSelectedElement(null);
      }
    } else {
      setPreviewCode(code);
      setHasUnsavedChanges(false);
      setSelectedElement(null);
    }
  };

  const handlePreview = () => {
    setPreviewCode(code);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Code Editor */}
      <div className="w-1/2 border-r border-gray-700 flex flex-col bg-gray-900/95 backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-300">Code Editor</h2>
          <div className="flex gap-3">
            {showDetailsButton && (
              <button
                onClick={() => {
                  console.log("Details button clicked");
                  if (onDetailsClick) onDetailsClick();
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Settings className="w-3 h-3" />
                Details
              </button>
            )}
            <button
              onClick={handlePreview}
              disabled={!hasUnsavedChanges || readOnly}
              className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl font-medium transition-all duration-300 ${
                hasUnsavedChanges && !readOnly
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Play className="w-3 h-3" />
              Preview
            </button>
            {showSaveButton && (
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saving || readOnly}
                className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl font-medium transition-all duration-300 ${
                  hasUnsavedChanges && !saving && !readOnly
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Save className="w-3 h-3" />
                {saving ? "Saving..." : onSave ? "Save" : "Save & Preview"}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            code={code}
            onChange={readOnly ? () => {} : handleCodeChange}
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* Preview and Properties */}
      <div className="w-1/2 flex flex-col bg-gray-900/95 backdrop-blur-sm">
        {/* Preview */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
            <h2 className="text-sm font-bold text-gray-300">Live Preview ✨</h2>
          </div>
          <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-gray-800">
            {error ? (
              <div className="p-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">!</span>
                    </div>
                    <p className="text-red-800 font-bold">
                      Error parsing component
                    </p>
                  </div>
                  <p className="text-red-600 text-sm leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            ) : (
              <Preview
                key={previewCode}
                code={previewCode}
                onElementSelect={setSelectedElement}
                selectedElement={selectedElement}
              />
            )}
          </div>
        </div>

        {/* Property Panel */}
        {selectedElement && (
          <div className="h-80 border-t border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
            <PropertyPanel
              selectedElement={selectedElement}
              onPropertyChange={handlePropertyChange}
              onClose={() => setSelectedElement(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
