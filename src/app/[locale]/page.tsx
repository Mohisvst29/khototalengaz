import React from "react";
import HomeClient from "@/components/HomeClient";
import connectToDatabase from "@/lib/mongodb";
import Property from "@/models/Property";
import Blog from "@/models/Blog";
import { mockProperties, mockBlogs } from "@/lib/seed-data";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "الرئيسية | شركة خطوط الإنجاز للعقارات" : "Home | Khotot Al-Engaz Real Estate",
    description: locale === 'ar' 
      ? "اكتشف أفضل العقارات في الرياض مع خطوط الإنجاز. فيلات وشقق ومشاريع سكنية وتجارية بمعايير حديثة."
      : "Discover the best properties in Riyadh with Khotot Al-Engaz. Villas, apartments, and residential/commercial projects with modern standards.",
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

async function getData() {
  try {
    await connectToDatabase();
    const properties = await Property.find({ featured: true }).limit(3).lean() || [];
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3).lean() || [];
    
    return {
      properties: properties.length > 0 ? JSON.parse(JSON.stringify(properties)) : mockProperties.slice(0, 3),
      blogs: blogs.length > 0 ? JSON.parse(JSON.stringify(blogs)) : mockBlogs.slice(0, 3),
    };
  } catch (error) {
    return {
      properties: mockProperties.slice(0, 3),
      blogs: mockBlogs.slice(0, 3),
    };
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { properties, blogs } = await getData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": locale === 'ar' ? "خطوط الإنجاز للعقارات" : "Khotot Al-Engaz Real Estate",
    "url": `https://khotot-alengaz.com/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://khotot-alengaz.com/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialProperties={properties} initialBlogs={blogs} />
    </>
  );
}
