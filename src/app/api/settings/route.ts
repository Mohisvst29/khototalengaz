import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({}).lean();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }

    // Force clear slides if they are the default placeholder to allow user a clean start
    if (settings.hero?.slides?.length === 1 && (settings.hero.slides[0].url?.includes('unsplash') || settings.hero.slides[0].url === '/hero-bg.jpg')) {
      settings.hero.slides = [];
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    let settings = await Settings.findOne({});
    
    if (settings) {
      settings = await Settings.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      settings = await Settings.create(data);
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
