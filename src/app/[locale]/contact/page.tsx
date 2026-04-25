import { Metadata } from "next";
import ContactClient from "./ContactClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "تواصل معنا | نحن هنا لخدمتك" : "Contact Us | We Are Here to Serve You",
    description: locale === 'ar' 
      ? "هل لديك استفسار عن عقار معين؟ تواصل مع فريق شركة خطوط الإنجاز للتطوير العقاري عبر الهاتف، الواتساب، أو من خلال زيارة مكتبنا."
      : "Have an inquiry about a property? Contact the Khotot Al-Engaz Real Estate Development team via phone, WhatsApp, or by visiting our office.",
  };
}

export default async function ContactPage() {
  return <ContactClient />;
}
