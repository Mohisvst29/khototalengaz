import { MetadataRoute } from "next";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Property from "@/models/Property";
import { mockBlogs, mockProperties } from "@/lib/seed-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://khotot-alengaz.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/sale",
    "/rent",
    "/projects",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Blog routes
  let blogPosts = [];
  try {
    await connectToDatabase();
    const dbBlogs = await Blog.find({}, "slug updatedAt").lean();
    blogPosts = dbBlogs.length > 0 ? dbBlogs : mockBlogs;
  } catch (error) {
    blogPosts = mockBlogs;
  }

  const blogRoutes = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.createdAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic Property routes (using _id for now as slug isn't implemented yet)
  let properties = [];
  try {
    const dbProps = await Property.find({}, "_id updatedAt").lean();
    properties = dbProps.length > 0 ? dbProps : mockProperties;
  } catch (error) {
    properties = mockProperties;
  }

  const propertyRoutes = properties.map((prop: any) => ({
    url: `${baseUrl}/properties/${prop._id}`, // Adjust if you implement slugs
    lastModified: prop.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...propertyRoutes];
}
