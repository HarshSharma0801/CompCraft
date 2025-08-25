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
  if (property === "text") {
    return updateTextContent(code, selectedElement, value);
  } else {
    return updateStyleProperty(code, selectedElement, property, value);
  }
}

function updateTextContent(
  code: string,
  selectedElement: SelectedElement,
  newText: string
): string {
  if (!selectedElement.text) return code;

  // Strategy 1: Exact text match with tag context
  if (selectedElement.tagName && selectedElement.signature) {
    const signature = selectedElement.signature;

    // Find the exact element using multiple attributes
    const patterns = [
      // Pattern 1: Tag with exact text content
      new RegExp(
        `(<${signature.tag}[^>]*>)([^<]*${escapeRegExp(
          selectedElement.text
        )}[^<]*)(</${signature.tag}>)`,
        "gi"
      ),
      // Pattern 2: Tag with classes and text
      signature.classes &&
        new RegExp(
          `(<${signature.tag}[^>]*className="[^"]*${escapeRegExp(
            signature.classes
          )}[^"]*"[^>]*>)([^<]*${escapeRegExp(selectedElement.text)}[^<]*)(</${
            signature.tag
          }>)`,
          "gi"
        ),
    ].filter(Boolean);

    for (const pattern of patterns) {
      if (pattern && code.match(pattern)) {
        return code.replace(pattern, (match, openTag, content, closeTag) => {
          const newContent = content.replace(
            new RegExp(escapeRegExp(selectedElement.text!), "gi"),
            newText
          );
          return openTag + newContent + closeTag;
        });
      }
    }
  }

  // Fallback: Simple text replacement (less precise)
  return code.replace(
    new RegExp(escapeRegExp(selectedElement.text), "g"),
    newText
  );
}

function updateStyleProperty(
  code: string,
  selectedElement: SelectedElement,
  property: string,
  value: string
): string {
  if (!selectedElement.signature) {
    return code;
  }

  const signature = selectedElement.signature;

  // Strategy 1: Multi-attribute matching for highest precision
  const elementMatcher = new ElementMatcher(code, selectedElement);
  const targetElement = elementMatcher.findBestMatch();

  if (targetElement) {
    return updateElementStyle(code, targetElement, property, value);
  }

  return code;
}

class ElementMatcher {
  private code: string;
  private selectedElement: SelectedElement;
  private elements: Array<{
    fullMatch: string;
    openTag: string;
    content: string;
    closeTag: string;
    tagName: string;
    attributes: string;
    textContent: string;
    position: number;
    score: number;
  }> = [];

  constructor(code: string, selectedElement: SelectedElement) {
    this.code = code;
    this.selectedElement = selectedElement;
    this.parseElements();
  }

  private parseElements() {
    if (!this.selectedElement.signature) return;

    const tagName = this.selectedElement.signature.tag;
    const elementRegex = new RegExp(
      `(<${tagName}[^>]*>)(.*?)(</${tagName}>)`,
      "gis"
    );

    let match;
    let position = 0;

    while ((match = elementRegex.exec(this.code)) !== null) {
      const [fullMatch, openTag, content, closeTag] = match;
      const textContent = content.replace(/<[^>]*>/g, "").trim();

      this.elements.push({
        fullMatch,
        openTag,
        content,
        closeTag,
        tagName,
        attributes: this.extractAttributes(openTag),
        textContent,
        position,
        score: this.calculateMatchScore(openTag, textContent, position),
      });

      position++;
    }

    // Sort by score (highest first)
    this.elements.sort((a, b) => b.score - a.score);
  }

  private extractAttributes(openTag: string): string {
    const attrMatch = openTag.match(/<\w+(.*)>/);
    return attrMatch ? attrMatch[1].trim() : "";
  }

  private calculateMatchScore(
    openTag: string,
    textContent: string,
    position: number
  ): number {
    let score = 0;
    const signature = this.selectedElement.signature!;

    // Text content match (highest weight)
    if (
      signature.text &&
      textContent.toLowerCase().includes(signature.text.toLowerCase())
    ) {
      score += 100;
      // Exact match gets bonus
      if (textContent.trim() === signature.text.trim()) {
        score += 50;
      }
    }

    // Class name match
    if (signature.classes && openTag.includes(signature.classes)) {
      score += 30;
    }

    // Position match (if we have multiple similar elements)
    if (position === signature.position) {
      score += 20;
    }

    // ID match (if present)
    if (signature.id && openTag.includes(`id="${signature.id}"`)) {
      score += 40;
    }

    // Child count match
    const childMatches = (textContent.match(/<\w+/g) || []).length;
    if (childMatches === signature.childCount) {
      score += 10;
    }

    return score;
  }

  findBestMatch() {
    return this.elements.length > 0 ? this.elements[0] : null;
  }
}

function updateElementStyle(
  code: string,
  element: any,
  property: string,
  value: string
): string {
  const { fullMatch, openTag, content, closeTag } = element;

  // Check if the opening tag already has a style attribute
  const existingStyleMatch = openTag.match(/style={{([^}]+)}}/);

  let newOpenTag;
  if (existingStyleMatch) {
    // Update existing style
    const existingStyles = existingStyleMatch[1];

    const styleObj = parseInlineStyles(existingStyles);

    // Update the specific property with proper formatting
    if (property === "fontSize") {
      styleObj[property] = `"${value}"`;
    } else if (property === "fontWeight") {
      styleObj[property] = value;
    } else if (property === "color" || property === "backgroundColor") {
      styleObj[property] = `"${value}"`;
    } else {
      styleObj[property] = `"${value}"`;
    }

    // Rebuild the style object
    const newStyles = Object.entries(styleObj)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");

    newOpenTag = openTag.replace(/style={{[^}]+}}/, `style={{${newStyles}}}`);
  } else {
    // Add new style attribute
    const styleValue =
      property === "fontWeight"
        ? `{{${property}: ${value}}}`
        : `{{${property}: "${value}"}}`;

    newOpenTag = openTag.replace(
      `<${element.tagName}`,
      `<${element.tagName} style=${styleValue}`
    );
  }

  const newElement = newOpenTag + content + closeTag;

  return code.replace(fullMatch, newElement);
}

function parseInlineStyles(styles: string): Record<string, string> {
  const styleObj: Record<string, string> = {};

  // Handle complex style strings that might have nested quotes and commas
  let currentPair = "";
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < styles.length; i++) {
    const char = styles[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      currentPair += char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = "";
      currentPair += char;
    } else if (char === "(" && !inQuotes) {
      depth++;
      currentPair += char;
    } else if (char === ")" && !inQuotes) {
      depth--;
      currentPair += char;
    } else if (char === "," && depth === 0 && !inQuotes) {
      // This is a separator between style properties
      processPair(currentPair.trim(), styleObj);
      currentPair = "";
    } else {
      currentPair += char;
    }
  }

  // Process the last pair
  if (currentPair.trim()) {
    processPair(currentPair.trim(), styleObj);
  }

  return styleObj;
}

function processPair(pair: string, styleObj: Record<string, string>) {
  const colonIndex = pair.indexOf(":");
  if (colonIndex > 0) {
    const key = pair.substring(0, colonIndex).trim();
    const value = pair.substring(colonIndex + 1).trim();
    if (key && value) {
      styleObj[key] = value;
    }
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
