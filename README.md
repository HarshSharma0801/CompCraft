# React Component Editor

A visual editor for React components that allows you to paste any React component code and edit it visually by selecting elements and modifying their properties.

## Features

- **Live Component Preview**: Paste any React function component and see it rendered instantly
- **Visual Selection**: Click on any element in the preview to select it
- **Property Editing**: Edit selected elements' properties including:
  - Text content
  - Text color
  - Background color
  - Font size
  - Font weight (from thin to extrabold)
- **Code Synchronization**: Changes made visually are reflected back in the code
- **Monaco Editor**: Professional code editing experience with syntax highlighting
- **Tailwind CSS Support**: Full support for Tailwind classes in your components

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or download the code
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Paste Your Component**: Copy any React function component and paste it into the code editor on the left side.

2. **Preview Your Component**: The component will be rendered in real-time in the preview panel on the right.

3. **Select Elements**: Click on any element in the preview to select it. Selected elements will be highlighted with a blue outline.

4. **Edit Properties**: When an element is selected, the property panel will appear at the bottom right. You can edit:

   - Text content (for text elements)
   - Text color
   - Background color
   - Font size (10px to 48px)
   - Font weight (100 to 800)

5. **See Code Updates**: As you make changes in the property panel, the code will automatically update to reflect your changes.

## Example Components

Try pasting these example components:

### Simple Button

```jsx
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Click me
    </button>
  );
}
```

### Card Component

```jsx
function Card() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to React Editor
        </h2>
        <p className="text-gray-600 mb-4">
          Click on any element to edit its properties.
        </p>
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg">
          Try Me!
        </button>
      </div>
    </div>
  );
}
```

### Hero Section

```jsx
function Hero() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Build Amazing Things
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Visual editing for your React components
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Technical Details

- Built with **Next.js 14** and **TypeScript**
- Uses **Monaco Editor** for code editing
- **Babel Standalone** for real-time component transpilation
- **Tailwind CSS** for styling
- Component rendering in sandboxed iframe for security
- Real-time code parsing and AST manipulation for property updates

## Limitations

- Currently supports function components only (no class components)
- Limited to editing text, colors, font size, and font weight
- Code updates are simplified and may not preserve all formatting
- Complex components with state or hooks may not update perfectly

## Development

To contribute or modify the editor:

1. The main editor logic is in `components/ComponentEditor.tsx`
2. Component rendering happens in `components/Preview.tsx`
3. Property editing UI is in `components/PropertyPanel.tsx`
4. Code parsing and updates are handled in `lib/codeParser.ts`

## Future Enhancements

- Support for more CSS properties
- Better AST parsing for more accurate code updates
- Support for component props editing
- Undo/redo functionality
- Export edited components
- Support for multiple components in one file
