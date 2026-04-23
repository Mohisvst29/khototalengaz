import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET() {
  try {
    await connectToDatabase();
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(messages || []);
  } catch (error: any) {
    console.error("GET Messages Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const message = await Message.create(data);
    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
