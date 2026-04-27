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
  
  let title = locale === 'ar' ? (seo.metaTitle || "خطوط الإنجاز للتطوير العقاري") : (seo.metaTitleEn || "خطوط الإنجاز للتطوير العقاري");
  let description = locale === 'ar' ? seo.metaDescription : seo.metaDescriptionEn;

  // Ensure 'للعقارات' is replaced with 'للتطوير العقاري' if present in the database values
  if (locale === 'ar' && title) {
    title = title.replace("للعقارات", "للتطوير العقاري");
  }
  if (locale === 'ar' && description) {
    description = description.replace("للعقارات", "للتطوير العقاري");
  }
  
  return {
    title: title,
    description: description,
    keywords: locale === 'ar' ? seo.keywords : seo.keywordsEn,
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
