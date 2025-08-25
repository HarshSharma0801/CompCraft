import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Component from "@/models/Component";
import mongoose from "mongoose";

// GET /api/preview/[id] - Get component for preview (public access)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const componentId = params.id;

    if (!mongoose.Types.ObjectId.isValid(componentId)) {
      return NextResponse.json(
        { error: "Invalid component ID" },
        { status: 400 }
      );
    }

    const component = await Component.findById(componentId).select(
      "title code description tags isPublic"
    );

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    // For preview endpoint, allow access to public components without authentication
    if (!component.isPublic) {
      return NextResponse.json(
        { error: "Component is private" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      component: {
        id: component._id,
        title: component.title,
        code: component.code,
        description: component.description,
        tags: component.tags,
      },
    });
  } catch (error) {
    console.error("Error fetching component for preview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
