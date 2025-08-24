"use client";

import React, { useEffect, useRef, useState } from "react";
import { transform } from "@babel/standalone";
import { SelectedElement } from "@/types";

interface PreviewProps {
  code: string;
  onElementSelect: (element: SelectedElement | null) => void;
  selectedElement: SelectedElement | null;
}

export default function Preview({
  code,
  onElementSelect,
  selectedElement,
}: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    console.log(
      "[Preview] Code changed, forcing iframe recreation:",
      code.substring(0, 50) + "..."
    );

    setIsLoading(true);
    setError(null);

    // Force iframe to recreate by updating key
    setIframeKey((prev) => prev + 1);
  }, [code]);

  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      // Transform the code using Babel
      const transformedCode = transform(code, {
        presets: ["react"],
        filename: "component.jsx",
      }).code;

      console.log(
        "[Preview] Transformed code:",
        transformedCode?.substring(0, 100) + "..."
      );

      // Create the HTML content for the iframe
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              .selected-element {
                outline: 2px solid #3B82F6 !important;
                outline-offset: 2px !important;
                position: relative;
              }
              .hoverable-element {
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
              }
              .hoverable-element:hover {
                outline: 2px dashed #93C5FD;
                outline-offset: 2px;
              }
              .hoverable-element::after {
                content: '';
                position: absolute;
                inset: -2px;
                background: transparent;
                pointer-events: none;
                border-radius: inherit;
              }
              .selected-element::after {
                background: rgba(59, 130, 246, 0.1);
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script>
              console.log('[IFrame] Script starting');
              
              // Safely get React and ReactDOM
              const React = window.React;
              const ReactDOM = window.ReactDOM;
              
              if (!React || !ReactDOM) {
                throw new Error('React or ReactDOM not loaded');
              }
              
              console.log('[IFrame] React and ReactDOM loaded successfully');

              // Helper function to get element signature for precise matching
              function getElementSignature(element) {
                const tagName = element.tagName.toLowerCase();
                const textContent = element.textContent?.trim() || '';
                const className = element.className || '';
                const id = element.id || '';
                
                // Create a unique signature based on multiple attributes
                const signature = {
                  tag: tagName,
                  text: textContent.substring(0, 50), // First 50 chars
                  classes: className.split(' ').filter(c => !c.includes('hoverable') && !c.includes('selected')).join(' '),
                  id: id,
                  hasChildren: element.children.length > 0,
                  childCount: element.children.length,
                  position: Array.from(element.parentElement?.children || []).indexOf(element)
                };
                
                return signature;
              }

              // Enhanced element path generation
              function generateElementPath(element, root) {
                const path = [];
                let current = element;
                
                while (current && current !== root && current !== document.body) {
                  const parent = current.parentElement;
                  if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(current);
                    const tagIndex = siblings.filter((sibling, i) => 
                      i <= index && sibling.tagName === current.tagName
                    ).length - 1;
                    
                    path.unshift({
                      index: index,
                      tagIndex: tagIndex,
                      tagName: current.tagName.toLowerCase()
                    });
                  }
                  current = parent;
                }
                
                return path;
              }

              // Helper function to add click handlers
              function addClickHandlers(element, path = '') {
                if (!element || element.nodeType !== 1) return;

                // Skip the root element
                if (element.id !== 'root') {
                  element.classList.add('hoverable-element');
                  element.dataset.path = path;
                  
                  element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // Remove previous selection
                    document.querySelectorAll('.selected-element').forEach(el => {
                      el.classList.remove('selected-element');
                    });
                    
                    // Add selection to clicked element
                    element.classList.add('selected-element');
                    
                    // Get computed styles
                    const computedStyles = window.getComputedStyle(element);
                    const signature = getElementSignature(element);
                    const elementPath = generateElementPath(element, document.getElementById('root'));
                    
                    // Determine if it's primarily a text element
                    const isTextElement = element.children.length === 0 || 
                      (element.children.length === 1 && element.children[0].nodeType === 3);
                    
                    // Get element info with enhanced data
                    const elementInfo = {
                      path: element.dataset.path,
                      enhancedPath: elementPath,
                      signature: signature,
                      type: isTextElement ? 'text' : 'element',
                      tagName: element.tagName.toLowerCase(),
                      text: isTextElement ? element.textContent?.trim() : element.innerText?.trim(),
                      directText: element.childNodes.length > 0 ? 
                        Array.from(element.childNodes)
                          .filter(node => node.nodeType === 3)
                          .map(node => node.textContent?.trim())
                          .filter(text => text)
                          .join(' ') : '',
                      className: element.className.replace(/hoverable-element|selected-element/g, '').trim(),
                      style: element.getAttribute('style') || '',
                      computedStyles: {
                        color: computedStyles.color,
                        backgroundColor: computedStyles.backgroundColor,
                        fontSize: computedStyles.fontSize,
                        fontWeight: computedStyles.fontWeight,
                        fontFamily: computedStyles.fontFamily,
                        textAlign: computedStyles.textAlign,
                        padding: computedStyles.padding,
                        margin: computedStyles.margin,
                        borderRadius: computedStyles.borderRadius,
                        display: computedStyles.display
                      },
                      bounds: element.getBoundingClientRect()
                    };
                    
                    console.log('[IFrame] Selected element:', elementInfo);
                    
                    // Send message to parent
                    window.parent.postMessage({
                      type: 'element-selected',
                      element: elementInfo
                    }, '*');
                  });
                }

                // Add handlers to children
                Array.from(element.children).forEach((child, index) => {
                  const childPath = path ? path + '.' + index : String(index);
                  addClickHandlers(child, childPath);
                });
              }

              try {
                console.log('[IFrame] Starting component execution');
                
                // Clean up any previous components
                Object.keys(window).forEach(key => {
                  if (typeof window[key] === 'function' && 
                      key[0] === key[0].toUpperCase() &&
                      key !== 'React' && 
                      key !== 'ReactDOM' &&
                      !key.startsWith('_')) {
                    console.log('[IFrame] Cleaning up:', key);
                    delete window[key];
                  }
                });

                // Execute the transformed code
                console.log('[IFrame] Executing transformed code');
                eval(\`${transformedCode || ""}\`);
                
                // Find the component function
                const componentKeys = Object.keys(window).filter(key => 
                  typeof window[key] === 'function' && 
                  key[0] === key[0].toUpperCase() &&
                  key !== 'React' && 
                  key !== 'ReactDOM' &&
                  !key.startsWith('_')
                );
                
                let Component = null;
                if (componentKeys.length > 0) {
                  Component = window[componentKeys[componentKeys.length - 1]];
                  console.log('Found component:', componentKeys[componentKeys.length - 1]);
                } else {
                  throw new Error('No component function found after execution');
                }
                
                if (!Component || typeof Component !== 'function') {
                  throw new Error('Component is not a valid React function');
                }
                
                // Create root and render
                const rootElement = document.getElementById('root');
                const root = ReactDOM.createRoot(rootElement);
                root.render(React.createElement(Component));
                
                // Add click handlers after render
                setTimeout(() => {
                  const rootEl = document.getElementById('root');
                  if (rootEl && rootEl.firstElementChild) {
                    addClickHandlers(rootEl.firstElementChild, '0');
                  }
                  // Signal that loading is complete
                  window.parent.postMessage({ type: 'preview-loaded' }, '*');
                }, 100);
                
              } catch (err) {
                console.error('[IFrame] Error rendering component:', err);
                const rootElement = document.getElementById('root');
                rootElement.innerHTML = 
                  '<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 4px; background: #fef2f2;">' +
                  '<strong>Error:</strong> ' + (err.message || err) +
                  '<br><br>Make sure your component is a valid React function component.' +
                  '</div>';
                // Signal error to parent
                window.parent.postMessage({ type: 'preview-error', error: err.message || err }, '*');
              }
            </script>
          </body>
        </html>
      `;

      // Write the content to the iframe
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        console.log("[Preview] Writing to iframe document");

        // Write the new content
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
        console.log("[Preview] Iframe content written successfully");
      }

      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error("[Preview] Error in useEffect:", err);
      setError(
        err instanceof Error ? err.message : "Failed to render component"
      );
      setIsLoading(false);
    }
  }, [iframeKey]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("[Preview] Received message:", event.data);
      if (event.data.type === "element-selected") {
        onElementSelect(event.data.element);
      } else if (event.data.type === "preview-loaded") {
        console.log("[Preview] Preview loaded successfully");
        setIsLoading(false);
      } else if (event.data.type === "preview-error") {
        console.error("[Preview] Preview error:", event.data.error);
        setError(event.data.error);
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onElementSelect]);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">
            Error rendering component:
          </p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-muted-foreground text-sm">
            Loading preview...
          </div>
        </div>
      )}
      <iframe
        key={iframeKey}
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Component Preview"
      />
    </div>
  );
}
