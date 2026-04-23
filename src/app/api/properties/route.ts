import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const city = searchParams.get("city");
  const type = searchParams.get("type");

  try {
    await connectToDatabase();
    
    let query: any = {};
    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (city) query.city = city;
    if (type) query.type = type;

    const properties = await Property.find(query).sort({ createdAt: -1 }).lean();
    console.log("PROPERTIES:", properties);
    return NextResponse.json(properties || []);
  } catch (error: any) {
    console.error("Properties GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const property = await Property.create(data);
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error("POST PROPERTY ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
