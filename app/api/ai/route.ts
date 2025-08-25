import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Generating component for prompt:", prompt);
    console.log("Using API key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a React component based on this description: "${prompt}". 

Return ONLY the component code in this exact format:

function ComponentName() {
  return (
    // JSX here
  )
}

Requirements:
- Use Tailwind CSS for styling
- Make it visually appealing and modern
- No imports or exports
- Use semantic HTML elements
- Include hover effects where appropriate
- Make it responsive
- Component name should be descriptive based on the prompt`,
                },
              ],
            },
          ],
        }),
      }
    );

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No content generated from Gemini API");
    }

    // Clean up the generated text and extract component code
    let componentCode = generatedText.trim();
    
    // Remove markdown code blocks if present
    componentCode = componentCode.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '');
    
    // Try to extract just the function if there's extra text
    const functionMatch = componentCode.match(/function\s+\w+\(\)[\s\S]*?^}/m);
    if (functionMatch) {
      componentCode = functionMatch[0];
    }

    console.log("Final component code:", componentCode);

    return NextResponse.json({
      success: true,
      code: componentCode,
    });
  } catch (error) {
    console.error("Error generating component:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate component" },
      { status: 500 }
    );
  }
}