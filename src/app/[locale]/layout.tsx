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
  title: "خطوط الإنجاز",
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
