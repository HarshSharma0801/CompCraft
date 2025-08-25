import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Component from "@/models/Component";
import User from "@/models/User";

// POST /api/component - Create new component
export async function POST(request: NextRequest) {
  try {
    const authResult = await auth();
    console.log("Full auth result:", JSON.stringify(authResult, null, 2));

    const { userId: clerkId } = authResult;
    console.log("Auth check - clerkId:", clerkId);

    if (!clerkId) {
      console.log("No clerkId found - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    console.log("Connected to DB, looking for user with clerkId:", clerkId);

    // Get or create user in our database
    let user = await User.findOne({ clerkId });

    console.log("Found existing user:", user?._id);

    if (!user) {
      // Create new user automatically
      console.log("Creating new user...");
      user = new User({
        clerkId,
        email: "", // We'll get this from Clerk if available
        firstName: "",
        lastName: "",
      });
      await user.save();
      console.log("User auto-created:", user._id);
    }

    const { title, code, description, tags, isPublic } = await request.json();

    if (!title || !code) {
      return NextResponse.json(
        { error: "Title and code are required" },
        { status: 400 }
      );
    }

    const component = new Component({
      title,
      code,
      description,
      tags: tags || [],
      isPublic: isPublic || false,
      userId: user._id,
    });

    await component.save();

    return NextResponse.json(
      {
        success: true,
        component: {
          id: component._id,
          title: component.title,
          code: component.code,
          description: component.description,
          tags: component.tags,
          isPublic: component.isPublic,
          createdAt: component.createdAt,
          updatedAt: component.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/component - Get user's components
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    console.log("GET Auth check - clerkId:", clerkId);

    if (!clerkId) {
      console.log("GET No clerkId found - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    console.log("GET Connected to DB, looking for user with clerkId:", clerkId);

    // Get or create user in our database
    let user = await User.findOne({ clerkId });

    console.log("GET Found existing user:", user?._id);

    if (!user) {
      // Create new user automatically
      console.log("GET Creating new user...");
      user = new User({
        clerkId,
        email: "", // We'll get this from Clerk if available
        firstName: "",
        lastName: "",
      });
      await user.save();
      console.log("GET User auto-created:", user._id);
    }

    const components = await Component.find({ userId: user._id })
      .select("title description tags isPublic createdAt updatedAt")
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      components: components.map((comp) => ({
        id: comp._id,
        title: comp.title,
        description: comp.description,
        tags: comp.tags,
        isPublic: comp.isPublic,
        createdAt: comp.createdAt,
        updatedAt: comp.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
