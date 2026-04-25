import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectToDatabase();
    await Settings.updateOne({}, { $set: { "hero.slides": [] } });
    return NextResponse.json({ message: "Default slides cleared successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
