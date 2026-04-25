import { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";
import { getTranslation } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getTranslation(locale);
  const serviceKey = Object.keys(t.services.list).find(key => t.services.list[key].slug === slug);
  const service = serviceKey ? t.services.list[serviceKey] : null;

  return {
    title: service ? `${service.title} | شركة خطوط الإنجاز للتطوير العقاري` : "خدماتنا | شركة خطوط الإنجاز للتطوير العقاري",
    description: service?.desc || "",
  };
}

export default function ServicePage() {
  return <ServiceDetailClient />;
}
