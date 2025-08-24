"use client";

import React, { useState, useEffect } from "react";
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
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("16");
  const [fontWeight, setFontWeight] = useState("normal");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    // Extract current values from the selected element
    if (selectedElement.text) {
      setText(selectedElement.text);
    }

    // Parse style properties
    if (selectedElement.className) {
      // Extract Tailwind classes
      const classes = selectedElement.className.split(" ");

      // Extract text color
      const textColorClass = classes.find((c) => c.startsWith("text-"));
      if (textColorClass) {
        // Convert Tailwind color to hex (simplified)
        const colorMap: Record<string, string> = {
          "text-white": "#ffffff",
          "text-black": "#000000",
          "text-blue-500": "#3B82F6",
          "text-red-500": "#EF4444",
          "text-green-500": "#10B981",
          "text-gray-500": "#6B7280",
        };
        setColor(colorMap[textColorClass] || "#000000");
      }

      // Extract font size
      const fontSizeClass = classes.find((c) => c.startsWith("text-"));
      if (fontSizeClass) {
        const sizeMap: Record<string, string> = {
          "text-xs": "12",
          "text-sm": "14",
          "text-base": "16",
          "text-lg": "18",
          "text-xl": "20",
          "text-2xl": "24",
          "text-3xl": "30",
          "text-4xl": "36",
        };
        setFontSize(sizeMap[fontSizeClass] || "16");
      }

      // Extract font weight
      const fontWeightClass = classes.find((c) => c.startsWith("font-"));
      if (fontWeightClass) {
        const weightMap: Record<string, string> = {
          "font-thin": "100",
          "font-light": "300",
          "font-normal": "400",
          "font-medium": "500",
          "font-semibold": "600",
          "font-bold": "700",
          "font-extrabold": "800",
        };
        setFontWeight(weightMap[fontWeightClass] || "normal");
      }

      // Extract background color
      const bgColorClass = classes.find((c) => c.startsWith("bg-"));
      if (bgColorClass) {
        const bgColorMap: Record<string, string> = {
          "bg-white": "#ffffff",
          "bg-black": "#000000",
          "bg-blue-500": "#3B82F6",
          "bg-red-500": "#EF4444",
          "bg-green-500": "#10B981",
          "bg-gray-500": "#6B7280",
        };
        setBackgroundColor(bgColorMap[bgColorClass] || "#ffffff");
      }
    }
  }, [selectedElement]);

  const handleTextChange = (value: string) => {
    setText(value);
    onPropertyChange("text", value);
  };

  const handleColorChange = (value: string) => {
    setColor(value);
    onPropertyChange("color", value);
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    onPropertyChange("fontSize", value + "px");
  };

  const handleFontWeightChange = (value: string) => {
    setFontWeight(value);
    onPropertyChange("fontWeight", value);
  };

  const handleBackgroundColorChange = (value: string) => {
    setBackgroundColor(value);
    onPropertyChange("backgroundColor", value);
  };

  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Properties</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Element Info */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Element
          </p>
          <div className="bg-muted/50 rounded-md px-3 py-2">
            <p className="text-sm font-medium text-foreground">
              {selectedElement.tagName || "text"}
            </p>
          </div>
        </div>

        {/* Text Content */}
        {selectedElement.type === "text" && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
              <Type className="w-3 h-3" />
              Text Content
            </label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
          </div>
        )}

        {/* Text Color */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Palette className="w-3 h-3" />
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-10 h-10 border border-input rounded cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Palette className="w-3 h-3" />
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="w-10 h-10 border border-input rounded cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Maximize2 className="w-3 h-3" />
            Font Size
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="48"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-foreground w-12 text-right">
              {fontSize}px
            </span>
          </div>
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Bold className="w-3 h-3" />
            Font Weight
          </label>
          <select
            value={fontWeight}
            onChange={(e) => handleFontWeightChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="100">Thin</option>
            <option value="300">Light</option>
            <option value="400">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
            <option value="800">Extrabold</option>
          </select>
        </div>
      </div>
    </div>
  );
}
