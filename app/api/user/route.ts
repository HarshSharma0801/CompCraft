import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// POST /api/user - Create or update user on sign up
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { email, firstName, lastName } = await request.json();

    console.log("Creating/updating user for clerkId:", userId);

    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      // Update existing user
      user.email = email || user.email;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      await user.save();
      console.log("Updated existing user:", user._id);
    } else {
      // Create new user
      user = new User({
        clerkId: userId,
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
      });
      await user.save();
      console.log("Created new user:", user._id);
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/user - Get current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
