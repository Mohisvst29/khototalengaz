"use client";

import React from "react";
import PropertiesClient from "@/components/PropertiesClient";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

export default function RentClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  return (
    <PropertiesClient
      title={t.nav.rent}
      subtitle={locale === 'ar' ? "خيارات متنوعة للسكن والعمل بنظام الإيجار" : "Various options for living and working with a rental system"}
      category="rent"
    />
  );
}
