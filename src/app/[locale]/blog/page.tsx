import React from "react";
import BlogClient from "@/components/BlogClient";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { mockBlogs } from "@/lib/seed-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المدونة العقارية | نصائح وأخبار العقار في السعودية",
  description: "تابع أحدث المقالات والنصائح العقارية. دليلك لاختيار العقار المناسب، فهم السوق السعودي، وآخر أخبار التطوير العقاري.",
  alternates: {
    canonical: "/blog",
  },
};

async function getBlogs() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean() || [];
    return blogs.length > 0 ? JSON.parse(JSON.stringify(blogs)) : mockBlogs;
  } catch (error) {
    return mockBlogs;
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  
  return <BlogClient initialBlogs={blogs} />;
}
