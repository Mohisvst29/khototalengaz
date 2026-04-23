import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    await connectToDatabase();
    const { currentPassword, newPassword } = await req.json();

    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
