import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import LeadRequest from "@/models/LeadRequest";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const lead = await LeadRequest.create(data);
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error("Lead Request Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const leads = await LeadRequest.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(leads || []);
  } catch (error: any) {
    console.error("GET Requests Error:", error);
    return NextResponse.json([]);
  }
}
