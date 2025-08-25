"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Type, Palette, Maximize2, Bold } from "lucide-react";
import { SelectedElement } from "@/types";

interface PropertyPanelProps {
  selectedElement: SelectedElement;
  onPropertyChange: (property: string, value: string) => void;
  onClose: () => void;
}

export default function PropertyPanel({
  selectedElement,
  onPropertyChange,
  onClose,
}: PropertyPanelProps) {
  // State for form values
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("16");
  const [fontWeight, setFontWeight] = useState("400");

  // Editing state management
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingTextColor, setIsEditingTextColor] = useState(false);
  const [isEditingBgColor, setIsEditingBgColor] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedTextColor, setEditedTextColor] = useState("#000000");
  const [editedBgColor, setEditedBgColor] = useState("#ffffff");

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const elementSignatureRef = useRef("");

  // Generate a unique signature for the element
  const getElementSignature = (element: SelectedElement): string => {
    return `${element.path}-${element.tagName}-${element.type}`;
  };

  // Initialize form values when element changes
  useEffect(() => {
    const currentSignature = getElementSignature(selectedElement);
    const isNewElement = currentSignature !== elementSignatureRef.current;

    // Only update if it's a new element AND not currently editing anything
    if (
      isNewElement &&
      !isEditingText &&
      !isEditingTextColor &&
      !isEditingBgColor
    ) {
      const newText = selectedElement.text || selectedElement.directText || "";
      setText(newText);
      setEditedText(newText);

      // Update other properties
      if (selectedElement.computedStyles) {
        const styles = selectedElement.computedStyles;

        if (styles.color) {
          const newTextColor = parseColor(styles.color);
          setTextColor(newTextColor);
          setEditedTextColor(newTextColor);
        }

        if (
          styles.backgroundColor &&
          styles.backgroundColor !== "rgba(0, 0, 0, 0)"
        ) {
          const newBgColor = parseColor(styles.backgroundColor);
          setBackgroundColor(newBgColor);
          setEditedBgColor(newBgColor);
        } else {
          setBackgroundColor("#ffffff");
          setEditedBgColor("#ffffff");
        }

        if (styles.fontSize) {
          setFontSize(styles.fontSize.replace("px", ""));
        }

        if (styles.fontWeight) {
          setFontWeight(styles.fontWeight);
        }
      }

      elementSignatureRef.current = currentSignature;
    }
  }, [selectedElement, isEditingText, isEditingTextColor, isEditingBgColor]);

  // Convert RGB/RGBA to hex
  const parseColor = (color: string): string => {
    if (color.startsWith("#")) return color;

    const rgbMatch = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    );
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    return "#000000";
  };

  // Text editing functions
  const startEditingText = () => {
    setIsEditingText(true);
    setEditedText(text);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const applyTextChanges = () => {
    setText(editedText);
    onPropertyChange("text", editedText);
    setIsEditingText(false);
  };

  const cancelEditingText = () => {
    setIsEditingText(false);
    setEditedText(text);
  };

  // Color editing functions
  const startEditingTextColor = () => {
    setIsEditingTextColor(true);
    setEditedTextColor(textColor);
  };

  const applyTextColorChanges = () => {
    setTextColor(editedTextColor);
    onPropertyChange("color", editedTextColor);
    setIsEditingTextColor(false);
  };

  const cancelEditingTextColor = () => {
    setIsEditingTextColor(false);
    setEditedTextColor(textColor);
  };

  const startEditingBgColor = () => {
    setIsEditingBgColor(true);
    setEditedBgColor(backgroundColor);
  };

  const applyBgColorChanges = () => {
    setBackgroundColor(editedBgColor);
    onPropertyChange("backgroundColor", editedBgColor);
    setIsEditingBgColor(false);
  };

  const cancelEditingBgColor = () => {
    setIsEditingBgColor(false);
    setEditedBgColor(backgroundColor);
  };

  // Immediate update handlers
  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    onPropertyChange("fontSize", value + "px");
  };

  const handleFontWeightChange = (value: string) => {
    setFontWeight(value);
    onPropertyChange("fontWeight", value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      applyTextChanges();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditingText();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-black">
        <div>
          <h3 className="text-sm font-semibold text-white">Properties</h3>
          <p className="text-xs text-gray-300">
            {selectedElement.signature?.tag} • {selectedElement.type}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Element Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Element Info
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tag:</span>
              <span className="font-mono text-black">
                &lt;{selectedElement.tagName}&gt;
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-mono text-black">
                {selectedElement.type}
              </span>
            </div>
            {selectedElement.className && (
              <div className="flex justify-between">
                <span className="text-gray-600">Classes:</span>
                <span className="font-mono text-black text-right max-w-40 truncate">
                  {selectedElement.className}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Text Content */}
        {selectedElement.type === "text" && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-black flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Content
              </h4>
              {!isEditingText && (
                <button
                  onClick={startEditingText}
                  className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingText ? (
              <div className="space-y-3">
                <textarea
                  ref={textareaRef}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={3}
                  placeholder="Enter text content..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={applyTextChanges}
                    className="flex-1 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={cancelEditingText}
                    className="flex-1 px-3 py-2 text-sm bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-black border border-gray-200 min-h-[3rem] flex items-center">
                {text || "No text content"}
              </div>
            )}
          </div>
        )}

        {/* Text Color */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Text Color
            </h4>
            {!isEditingTextColor && (
              <button
                onClick={startEditingTextColor}
                className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingTextColor ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-12 h-10 rounded-lg border border-gray-300 overflow-hidden">
                  <input
                    type="color"
                    value={editedTextColor}
                    onChange={(e) => setEditedTextColor(e.target.value)}
                    className="w-full h-full cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={editedTextColor}
                  onChange={(e) => setEditedTextColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  placeholder="#000000"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyTextColorChanges}
                  className="flex-1 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={cancelEditingTextColor}
                  className="flex-1 px-3 py-2 text-sm bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border border-gray-300"
                style={{ backgroundColor: textColor }}
              ></div>
              <span className="font-mono text-sm text-black">{textColor}</span>
            </div>
          )}
        </div>

        {/* Background Color */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Background Color
            </h4>
            {!isEditingBgColor && (
              <button
                onClick={startEditingBgColor}
                className="px-3 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingBgColor ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-12 h-10 rounded-lg border border-gray-300 overflow-hidden">
                  <input
                    type="color"
                    value={editedBgColor}
                    onChange={(e) => setEditedBgColor(e.target.value)}
                    className="w-full h-full cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={editedBgColor}
                  onChange={(e) => setEditedBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  placeholder="#ffffff"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyBgColorChanges}
                  className="flex-1 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={cancelEditingBgColor}
                  className="flex-1 px-3 py-2 text-sm bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border border-gray-300"
                style={{ backgroundColor: backgroundColor }}
              ></div>
              <span className="font-mono text-sm text-black">
                {backgroundColor}
              </span>
            </div>
          )}
        </div>

        {/* Font Size */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            Font Size
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="8"
                max="72"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="flex-1 accent-black"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-center"
                  min="8"
                  max="72"
                />
                <span className="text-xs text-gray-600">px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Font Weight */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
            <Bold className="w-4 h-4" />
            Font Weight
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "100", label: "Thin" },
              { value: "300", label: "Light" },
              { value: "400", label: "Regular" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semibold" },
              { value: "700", label: "Bold" },
              { value: "800", label: "Extrabold" },
              { value: "900", label: "Black" },
            ].map((weight) => (
              <button
                key={weight.value}
                onClick={() => handleFontWeightChange(weight.value)}
                className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                  fontWeight === weight.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-50"
                }`}
                style={{ fontWeight: weight.value }}
              >
                {weight.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
