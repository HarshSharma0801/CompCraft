import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET endpoint for testing webhook
export async function GET() {
  try {
    await connectDB();
    const userCount = await User.countDocuments();
    return NextResponse.json({
      success: true,
      message: "Webhook endpoint is working",
      userCount,
      webhookUrl: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/webhooks/clerk`,
    });
  } catch (error) {
    console.error("Webhook test error:", error);
    return NextResponse.json(
      { error: "Webhook test failed", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Headers:", Object.fromEntries(request.headers));

    const payload = await request.json();
    console.log("Webhook payload type:", payload.type);
    console.log("Webhook payload data:", JSON.stringify(payload.data, null, 2));

    // Handle user.created event
    if (payload.type === "user.created") {
      console.log("Processing user.created event");

      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
      } = payload.data;

      console.log("Extracted clerkId:", clerkId);
      console.log("Extracted email:", email_addresses?.[0]?.email_address);

      await connectDB();
      console.log("Connected to database");

      // Check if user already exists
      const existingUser = await User.findOne({ clerkId });
      console.log("Existing user found:", existingUser?._id);

      if (!existingUser) {
        const user = new User({
          clerkId,
          email: email_addresses?.[0]?.email_address || "",
          firstName: first_name || "",
          lastName: last_name || "",
        });

        await user.save();
        console.log("✅ User created via webhook:", user._id);
      } else {
        console.log("User already exists, skipping creation");
      }
    }

    // Handle user.updated event
    if (payload.type === "user.updated") {
      console.log("Processing user.updated event");

      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
      } = payload.data;

      await connectDB();

      const user = await User.findOne({ clerkId });

      if (user) {
        user.email = email_addresses?.[0]?.email_address || user.email;
        user.firstName = first_name || user.firstName;
        user.lastName = last_name || user.lastName;
        await user.save();
        console.log("✅ User updated via webhook:", user._id);
      } else {
        console.log("User not found for update, skipping");
      }
    }

    console.log("=== WEBHOOK PROCESSING COMPLETE ===");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    console.error("Error stack:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
