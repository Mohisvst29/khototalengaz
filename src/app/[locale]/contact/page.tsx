import { Metadata } from "next";
import ContactClient from "./ContactClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "تواصل معنا | نحن هنا لخدمتك - خطوط الإنجاز للتطوير العقاري" : "Contact Us | We Are Here to Serve You - Khotot Al-Engaz Real Estate Development",
    description: locale === 'ar' 
      ? "تواصل مع فريق شركة خطوط الإنجاز للتطوير العقاري عبر الهاتف أو الواتساب. نحن هنا لمساعدتك في كافة استفساراتك العقارية."
      : "Contact the Khotot Al-Engaz Real Estate Development team via phone or WhatsApp. We are here to help with all your real estate inquiries.",
  };
}

export default async function ContactPage() {
  return <ContactClient />;
}
