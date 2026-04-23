import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { mockBlogs } from "@/lib/seed-data";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    await connectToDatabase();
    const blog = await Blog.findOne({ slug }).lean();
    
    if (!blog) {
      const fallback = mockBlogs.find((b) => b.slug === slug);
      if (fallback) return NextResponse.json(fallback);
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    // If error, try to extract slug again safely if possible
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
