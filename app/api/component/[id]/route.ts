import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Component from "@/models/Component";
import User from "@/models/User";
import mongoose from "mongoose";

// GET /api/component/[id] - Get specific component
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

    const component = await Component.findById(componentId);

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    // Check if component is public or user owns it
    const { userId: clerkId } = await auth();

    if (component.isPublic) {
      // Public component - no auth needed
    } else {
      // Private component - check ownership
      if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      let user = await User.findOne({ clerkId });
      if (!user) {
        // Create new user automatically
        user = new User({
          clerkId,
          email: "",
          firstName: "",
          lastName: "",
        });
        await user.save();
        console.log("User auto-created:", user._id);
      }

      if (component.userId.toString() !== user._id.toString()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.json({
      success: true,
      component: {
        id: component._id,
        title: component.title,
        code: component.code,
        description: component.description,
        tags: component.tags,
        isPublic: component.isPublic,
        userId: component.userId,
        createdAt: component.createdAt,
        updatedAt: component.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/component/[id] - Update component
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get or create user in our database
    let user = await User.findOne({ clerkId });
    if (!user) {
      // Create new user automatically
      user = new User({
        clerkId,
        email: "",
        firstName: "",
        lastName: "",
      });
      await user.save();
      console.log("User auto-created:", user._id);
    }

    const componentId = params.id;

    if (!mongoose.Types.ObjectId.isValid(componentId)) {
      return NextResponse.json(
        { error: "Invalid component ID" },
        { status: 400 }
      );
    }

    const { title, code, description, tags, isPublic } = await request.json();

    const component = await Component.findOne({
      _id: componentId,
      userId: user._id,
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update component
    if (title !== undefined) component.title = title;
    if (code !== undefined) component.code = code;
    if (description !== undefined) component.description = description;
    if (tags !== undefined) component.tags = tags;
    if (isPublic !== undefined) component.isPublic = isPublic;

    await component.save();

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error updating component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/component/[id] - Delete component
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get or create user in our database
    let user = await User.findOne({ clerkId });
    if (!user) {
      // Create new user automatically
      user = new User({
        clerkId,
        email: "",
        firstName: "",
        lastName: "",
      });
      await user.save();
      console.log("User auto-created:", user._id);
    }

    const componentId = params.id;

    if (!mongoose.Types.ObjectId.isValid(componentId)) {
      return NextResponse.json(
        { error: "Invalid component ID" },
        { status: 400 }
      );
    }

    const component = await Component.findOneAndDelete({
      _id: componentId,
      userId: user._id,
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Component deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
