"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Play, Save } from "lucide-react";
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
          Welcome to React Editor
        </h2>
        <p className="text-gray-600 mb-4">
          Click on any element to edit its properties. You can change text content, colors, font size, and font weight.
        </p>
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
          Try Me!
        </button>
      </div>
    </div>
  )
}`;

export default function ComponentEditor() {
  const [code, setCode] = useState(defaultCode);
  const [previewCode, setPreviewCode] = useState(defaultCode);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedComponent, setParsedComponent] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const handleSave = () => {
    setPreviewCode(code);
    setHasUnsavedChanges(false);
    setSelectedElement(null);
  };

  const handlePreview = () => {
    setPreviewCode(code);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">
          React Component Editor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste your React component code and edit it visually
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Code Editor
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePreview}
                disabled={!hasUnsavedChanges}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors ${
                  hasUnsavedChanges
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Play className="w-3 h-3" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors ${
                  hasUnsavedChanges
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Save className="w-3 h-3" />
                Save & Preview
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor code={code} onChange={handleCodeChange} />
          </div>
        </div>

        {/* Preview and Properties */}
        <div className="w-1/2 flex flex-col">
          {/* Preview */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground">Preview</h2>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              {error ? (
                <div className="p-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm font-medium">
                      Error parsing component:
                    </p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
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
            <div className="h-80 border-t border-border">
              <PropertyPanel
                selectedElement={selectedElement}
                onPropertyChange={handlePropertyChange}
                onClose={() => setSelectedElement(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
