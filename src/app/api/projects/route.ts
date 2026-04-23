import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find().lean();
    console.log("PROJECTS:", projects);
    return NextResponse.json(projects || []);
  } catch (error: any) {
    console.error("PROJECT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("POST PROJECT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
