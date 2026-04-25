import { Metadata } from "next";
import AboutClient from "./AboutClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "من نحن | شركة خطوط الإنجاز للتطوير العقاري" : "About Us | Khotot Al-Engaz Real Estate Development",
    description: locale === 'ar' 
      ? "تعرف على شركة خطوط الإنجاز للتطوير العقاري، شركة سعودية رائدة في إعادة تعريف مفهوم السكن والاستثمار من خلال مشاريع مبتكرة."
      : "Learn about Khotot Al-Engaz Real Estate Development, a leading Saudi company redefining the concept of housing and investment through innovative projects.",
  };
}

export default async function AboutPage() {
  return <AboutClient />;
}
