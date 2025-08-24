export interface SelectedElement {
  path: string;
  enhancedPath?: Array<{
    index: number;
    tagIndex: number;
    tagName: string;
  }>;
  signature?: {
    tag: string;
    text: string;
    classes: string;
    id: string;
    hasChildren: boolean;
    childCount: number;
    position: number;
  };
  type: "text" | "element";
  tagName?: string;
  props?: Record<string, any>;
  text?: string;
  directText?: string;
  className?: string;
  style?: string;
  computedStyles?: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    textAlign: string;
    padding: string;
    margin: string;
    borderRadius: string;
    display: string;
  };
  bounds?: DOMRect;
}
