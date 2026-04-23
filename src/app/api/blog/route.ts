import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { mockBlogs } from "@/lib/seed-data";

export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean() || [];
    const finalData = blogs.length > 0 ? blogs : mockBlogs;
    return NextResponse.json(finalData);
  } catch (error) {
    console.error("Blog API Error:", error);
    return NextResponse.json(mockBlogs);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const blog = await Blog.create(data);
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
