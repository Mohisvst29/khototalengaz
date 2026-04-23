import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    console.log("LOGIN DATA:", username, password);

    if (username === "admin" && password === "admin852") {
      // Set a simple cookie to satisfy the middleware
      (await cookies()).set("admin_token", "simple_token_for_now", {
        httpOnly: true,
        secure: false, // Set to false to work in all dev environments
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
