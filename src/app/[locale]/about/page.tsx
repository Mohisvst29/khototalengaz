import { Metadata } from "next";
import AboutClient from "./AboutClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "من نحن | شركة خطوط الإنجاز للعقارات" : "About Us | Khotot Al-Engaz Real Estate",
    description: locale === 'ar' 
      ? "تعرف على شركة خطوط الإنجاز للتطوير العقاري، رؤيتنا وأهدافنا في تقديم حلول عقارية متكاملة في المملكة العربية السعودية."
      : "Learn about Khotot Al-Engaz Real Estate Development, our vision and goals in providing integrated real estate solutions in Saudi Arabia.",
  };
}

export default async function AboutPage() {
  return <AboutClient />;
}
