import React from "react";
import HomeClient from "@/components/HomeClient";
import connectToDatabase from "@/lib/mongodb";
import Property from "@/models/Property";
import Blog from "@/models/Blog";
import Settings from "@/models/Settings";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {

  const { locale } = params;

  return {
    title: locale === 'ar'
      ? "شركة خطوط الإنجاز للتطوير العقاري"
      : "Khotot Al-Engaz Real Estate Development",

    description: locale === 'ar'
      ? `شركة خطوط الإنجاز للتطوير العقاري تقدم حلول تطوير واستثمار عقاري في السعودية، تشمل المشاريع السكنية والتجارية وإدارة الأصول بأعلى معايير الجودة.`
      : "Khotot Al-Engaz is a Saudi real estate development company offering investment, project management, and high-quality residential and commercial projects.",

    alternates: {
      canonical: `https://khotot-alengaz.com/${locale}`,
    },
  };
}

async function getData() {
  try {
    await connectToDatabase();

    const properties = await Property.find({ featured: true })
      .limit(3)
      .lean();

    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const settings = await Settings.findOne({}).lean();

    return {
      properties: properties ? JSON.parse(JSON.stringify(properties)) : [],
      blogs: blogs ? JSON.parse(JSON.stringify(blogs)) : [],
      settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
    };

  } catch (error) {
    return {
      properties: [],
      blogs: [],
      settings: null,
    };
  }
}

export default async function Home(
  { params }: { params: { locale: string } }
) {

  const { locale } = params;

  const { properties, blogs, settings } = await getData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": locale === 'ar'
      ? "خطوط الإنجاز للتطوير العقاري"
      : "Khotot Al-Engaz Real Estate Development",
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

      <HomeClient
        initialProperties={properties}
        initialBlogs={blogs}
        settings={settings}
      />
    </>
  );
}
