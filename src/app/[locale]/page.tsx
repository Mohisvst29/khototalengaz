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
      ? "خطوط الانجاز للتطوير العقاري"
      : "خطوط الانجاز للتطوير العقاري | Khotot Al-Engaz",

    description: locale === 'ar'
      ? `شركة خطوط الانجاز للتطوير العقاري تقدم حلول تطوير واستثمار عقاري في السعودية، تشمل المشاريع السكنية والتجارية وإدارة الأصول بأعلى معايير الجودة.`
      : "Khotot Al-Engaz is a Saudi real estate development company offering investment, project management, and high-quality residential and commercial projects.",

    alternates: {
      canonical: `https://khototalengaz.com/${locale}`,
      languages: {
        'ar': 'https://khototalengaz.com/ar',
        'en': 'https://khototalengaz.com/en',
        'x-default': 'https://khototalengaz.com/ar',
      },
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
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `https://khototalengaz.com/${locale}/#website`,
        "url": `https://khototalengaz.com/${locale}`,
        "name": "خطوط الانجاز للتطوير العقاري",
        "alternateName": "Khotot Al-Engaz Real Estate Development",
        "inLanguage": locale === 'ar' ? "ar" : "en",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `https://khototalengaz.com/${locale}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `https://khototalengaz.com/${locale}/#organization`,
        "name": "خطوط الانجاز للتطوير العقاري",
        "alternateName": ["Khotot Al-Engaz Real Estate Development", "شركة خطوط الإنجاز", "خطوط الإنجاز للاستثمار العقاري"],
        "url": `https://khototalengaz.com/${locale}`,
        "logo": "https://khototalengaz.com/favicon.ico",
        "description": "شركة متخصصة في التطوير العقاري في المملكة العربية السعودية.",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "SA"
        }
      }
    ]
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
