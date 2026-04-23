import { Metadata } from "next";
import RentClient from "./RentClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "وحدات للإيجار | شقق وفيلات للإيجار بالرياض" : "Units for Rent | Apartments and Villas for Rent in Riyadh",
    description: locale === 'ar' 
      ? "ابحث عن وحدتك القادمة للإيجار. شقق مفروشة، أدوار سكنية، ومكاتب تجارية في أفضل أحياء الرياض."
      : "Search for your next unit for rent. Furnished apartments, residential floors, and commercial offices in the best neighborhoods of Riyadh.",
  };
}

export default async function RentPage() {
  return <RentClient />;
}
