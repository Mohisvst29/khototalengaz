"use client";

import React from "react";
import PropertiesClient from "@/components/PropertiesClient";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

export default function SaleClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  return (
    <PropertiesClient
      title={t.nav.sale}
      subtitle={locale === 'ar' ? "اكتشف أفضل العقارات المتاحة للبيع في المملكة" : "Discover the best properties available for sale in the Kingdom"}
      category="sale"
    />
  );
}
