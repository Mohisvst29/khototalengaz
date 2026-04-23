import { MetadataRoute } from "next";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Property from "@/models/Property";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://khototalengaz.com";
  const locales = ["ar", "en"];

  // Static routes for both locales
  const staticPaths = [
    "",
    "/about",
    "/sale",
    "/rent",
    "/projects",
    "/blog",
    "/contact",
  ];

  const staticRoutes = locales.flatMap((locale) => 
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : 0.8,
    }))
  );

  // Dynamic Blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const dbBlogs = await Blog.find({}, "slug updatedAt").lean();
    
    blogRoutes = locales.flatMap((locale) => 
      dbBlogs.map((post: any) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    );
  } catch (error) {
    console.error("Sitemap Blog Error:", error);
  }

  // Dynamic Property routes
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbProps = await Property.find({}, "_id updatedAt").lean();
    
    propertyRoutes = locales.flatMap((locale) => 
      dbProps.map((prop: any) => ({
        url: `${baseUrl}/${locale}/properties/${prop._id}`,
        lastModified: prop.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );
  } catch (error) {
    console.error("Sitemap Property Error:", error);
  }

  return [...staticRoutes, ...blogRoutes, ...propertyRoutes];
}
