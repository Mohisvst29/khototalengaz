import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "خدماتنا | شركة خطوط الإنجاز للتطوير العقاري" : "Our Services | Khotot Al-Engaz Real Estate Development",
    description: locale === 'ar' 
      ? "تصفح خدماتنا العقارية المتكاملة من تطوير مشاريع سكنية وتجارية، إدارة أملاك، واستثمار عقاري مع شركة خطوط الإنجاز للتطوير العقاري."
      : "Browse our integrated real estate services from residential and commercial development, property management, and investment with Khotot Al-Engaz Real Estate Development.",
  };
}

export default function ServicesPage() {
  return <ServicesClient />;
}
