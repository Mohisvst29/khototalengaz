import { Metadata } from "next";
import SaleClient from "./SaleClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "وحدات للبيع | فيلات وشقق في الرياض" : "Units for Sale | Villas and Apartments in Riyadh",
    description: locale === 'ar' 
      ? "تصفح أحدث الوحدات العقارية المعروضة للبيع في الرياض. فيلات فاخرة، شقق استثمارية، وأدوار سكنية بأسعار تنافسية."
      : "Browse the latest real estate units for sale in Riyadh. Luxury villas, investment apartments, and residential floors at competitive prices.",
  };
}

export default async function SalePage() {
  return <SaleClient />;
}
