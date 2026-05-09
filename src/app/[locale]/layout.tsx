import { Tajawal, Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { Metadata } from "next";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  await dbConnect();
  const settings = await Settings.findOne({});

  const seo = settings?.seo || {};
  const branding = settings?.branding || { logo: "/favicon.ico" };
  
  const primaryArName = "خطوط الانجاز للتطوير العقاري";
  const primaryEnName = "Khotot Al-Engaz Real Estate Development";

  let title = locale === 'ar' ? (seo.metaTitle || primaryArName) : (seo.metaTitleEn || primaryEnName);
  let description = locale === 'ar' 
    ? (seo.metaDescription || "شركة خطوط الانجاز للتطوير العقاري تقدم حلولاً عقارية متكاملة في السعودية، تشمل المشاريع السكنية والتجارية والاستثمار العقاري.") 
    : (seo.metaDescriptionEn || "Khotot Al-Engaz is a Saudi real estate development company offering investment, project management, and high-quality residential and commercial projects.");

  if (locale === 'ar' && title) {
    title = title.replace("للعقارات", "للتطوير العقاري");
  }
  if (locale === 'ar' && description) {
    description = description.replace("للعقارات", "للتطوير العقاري");
  }
  
  const keywordsAr = seo.keywords || "التطوير العقاري, الاستثمار العقاري, العقارات في السعودية, شركة عقارية, خطوط الإنجاز, مشاريع سكنية, إدارة أملاك";
  
  return {
    metadataBase: new URL("https://khototalengaz.com"),
    alternates: {
      languages: {
        'ar': '/ar',
        'en': '/en',
        'x-default': '/ar',
      },
    },
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description: description,
    keywords: locale === 'ar' ? keywordsAr : seo.keywordsEn,
    openGraph: {
      title: title,
      description: description,
      siteName: primaryArName,
      locale: locale === 'ar' ? 'ar_AR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
    icons: {
      icon: branding.logo || "/favicon.ico",
      shortcut: branding.logo || "/favicon.ico",
      apple: branding.logo || "/favicon.ico",
    },
    verification: {
      google: "JT5ViAqhB9Q820_kMRUah7ziTi0XtzmyaMVjP3KJx9Q",
    }
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  // 💣 أهم شرط هنا
  const isAdmin = false; // هنظبطه تحت

  return (
    <html lang={locale} dir={dir} className={`${tajawal.variable} ${inter.variable}`}>
      <body>
        {isAdmin ? (
          children
        ) : (
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        )}
      </body>
    </html>
  );
}
