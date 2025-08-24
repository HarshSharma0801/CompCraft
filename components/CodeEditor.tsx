"use client";

import React from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="text-gray-600">Loading editor...</div>
    </div>
  ),
});

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <MonacoEditor
      height="100%"
      language="javascript"
      theme="vs-light"
      value={code}
      onChange={(value) => onChange(value || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        padding: { top: 16, bottom: 16 },
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      }}
    />
  );
}
