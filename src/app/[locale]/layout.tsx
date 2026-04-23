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

export const metadata: Metadata = {
  title: {
    default: "خطوط الإنجاز للعقارات | أفضل عقارات للبيع والإيجار في الرياض",
    template: "%s | خطوط الإنجاز للعقارات",
  },
  description:
    "شركة خطوط الإنجاز للعقارات تقدم أفضل الحلول العقارية في المملكة العربية السعودية. فيلات، شقق، ومكاتب تجارية للبيع والإيجار بأرقى الأحياء.",
  keywords: ["عقارات الرياض", "شقق للبيع", "فيلات للبيع", "إيجار شقق", "خطوط الإنجاز", "عقارات السعودية"],
  metadataBase: new URL("https://khotot-alengaz.com"), // Replace with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://khotot-alengaz.com",
    siteName: "خطوط الإنجاز للعقارات",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or use a default
        width: 1200,
        height: 630,
        alt: "خطوط الإنجاز للعقارات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "خطوط الإنجاز للعقارات",
    description: "أفضل العقارات في الرياض",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": locale === "ar" ? "خطوط الإنجاز للعقارات" : "Khotot Al-Engaz Real Estate",
    "url": "https://khotot-alengaz.com",
    "logo": "https://khotot-alengaz.com/logo.png",
    "sameAs": [
      "https://twitter.com/khotot",
      "https://facebook.com/khotot",
      "https://instagram.com/khotot"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966XXXXXXXXX",
      "contactType": "customer service",
      "areaServed": "SA",
      "availableLanguage": ["Arabic", "English"]
    }
  };

  return (
    <html lang={locale} dir={dir} className={`${tajawal.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
