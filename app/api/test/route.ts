import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const userCount = await User.countDocuments();
    const users = await User.find(
      {},
      { clerkId: 1, email: 1, createdAt: 1 }
    ).limit(5);

    return NextResponse.json({
      success: true,
      userCount,
      recentUsers: users,
      message: "Database connection and user collection working",
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      { error: "Database test failed", details: error.message },
      { status: 500 }
    );
  }
}
