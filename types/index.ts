export interface SelectedElement {
  path: string;
  type: "text" | "element";
  tagName?: string;
  props?: Record<string, any>;
  text?: string;
  className?: string;
  style?: Record<string, string>;
}
