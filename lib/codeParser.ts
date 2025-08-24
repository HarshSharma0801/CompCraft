import { SelectedElement } from "@/types";

export function parseComponent(code: string) {
  // Basic validation
  if (!code.trim()) {
    throw new Error("No code provided");
  }

  // Check if it's a valid function component
  const functionPattern = /(?:export\s+default\s+)?function\s+(\w+)\s*\(/;
  const arrowPattern =
    /(?:export\s+)?const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>/;
  const exportDefaultFunctionPattern = /export\s+default\s+function\s*\(/;

  const functionMatch = code.match(functionPattern);
  const arrowMatch = code.match(arrowPattern);
  const exportDefaultMatch = code.match(exportDefaultFunctionPattern);

  if (!functionMatch && !arrowMatch && !exportDefaultMatch) {
    // Check if it's just a simple return statement (might be missing function wrapper)
    if (
      code.includes("return") &&
      (code.includes("<") || code.includes("React.createElement"))
    ) {
      // Valid JSX found, assume it's a component
    } else {
      throw new Error(
        "No valid React component found. Please paste a function component."
      );
    }
  }

  let componentName = functionMatch?.[1] || arrowMatch?.[1] || "UIShowcase";

  return {
    name: componentName,
    type: functionMatch || exportDefaultMatch ? "function" : "arrow",
    isValid: true,
  };
}

export function updateComponentCode(
  code: string,
  selectedElement: SelectedElement,
  property: string,
  value: string
): string {
  // This is a simplified implementation
  // In a real app, you'd use a proper AST parser like @babel/parser

  let updatedCode = code;

  if (property === "text" && selectedElement.text) {
    // Update text content
    const escapedText = escapeRegExp(selectedElement.text);
    const textRegex = new RegExp(`(>)${escapedText}(<)`, "g");
    updatedCode = updatedCode.replace(textRegex, `$1${value}$2`);
  } else if (property === "color") {
    // Update text color
    updatedCode = updateStyleProperty(
      updatedCode,
      selectedElement,
      "color",
      value
    );
  } else if (property === "backgroundColor") {
    // Update background color
    updatedCode = updateStyleProperty(
      updatedCode,
      selectedElement,
      "backgroundColor",
      value
    );
  } else if (property === "fontSize") {
    // Update font size
    updatedCode = updateStyleProperty(
      updatedCode,
      selectedElement,
      "fontSize",
      value
    );
  } else if (property === "fontWeight") {
    // Update font weight
    updatedCode = updateStyleProperty(
      updatedCode,
      selectedElement,
      "fontWeight",
      value
    );
  }

  return updatedCode;
}

function updateStyleProperty(
  code: string,
  selectedElement: SelectedElement,
  property: string,
  value: string
): string {
  // This is a simplified approach - in production, use an AST parser

  // First, try to find inline styles
  const inlineStyleRegex = /style={{([^}]+)}}/g;
  const hasInlineStyle = code.match(inlineStyleRegex);

  if (hasInlineStyle) {
    // Update existing inline style
    return code.replace(inlineStyleRegex, (match, styles) => {
      const styleObj = parseInlineStyles(styles);
      styleObj[property] =
        property === "fontSize" || property === "fontWeight"
          ? value
          : `'${value}'`;
      const newStyles = Object.entries(styleObj)
        .map(([key, val]) => `${key}: ${val}`)
        .join(", ");
      return `style={{${newStyles}}}`;
    });
  } else {
    // Add inline style
    // Find the element and add style attribute
    // This is simplified - in production, use proper AST manipulation
    const elementRegex = new RegExp(`(<\\w+[^>]*)(>)`, "g");
    let elementIndex = 0;
    const targetIndex = parseInt(selectedElement.path.split(".").pop() || "0");

    return code.replace(elementRegex, (match, tag, closing) => {
      if (elementIndex === targetIndex) {
        elementIndex++;
        const styleValue =
          property === "fontSize" || property === "fontWeight"
            ? `{{${property}: ${value}}}`
            : `{{${property}: '${value}'}}`;
        return `${tag} style=${styleValue}${closing}`;
      }
      elementIndex++;
      return match;
    });
  }
}

function parseInlineStyles(styles: string): Record<string, string> {
  const styleObj: Record<string, string> = {};
  const pairs = styles.split(",").map((s) => s.trim());

  pairs.forEach((pair) => {
    const [key, value] = pair.split(":").map((s) => s.trim());
    if (key && value) {
      styleObj[key] = value;
    }
  });

  return styleObj;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
