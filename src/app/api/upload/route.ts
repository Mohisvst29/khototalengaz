import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Create directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if exists
    }

    const urls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueId = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueId}-${file.name.replace(/\s+/g, "-")}`;
      const path = join(uploadDir, fileName);
      
      await writeFile(path, buffer);
      urls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
