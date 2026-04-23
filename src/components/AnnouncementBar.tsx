"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const AnnouncementBar = () => {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });
  }, []);

  if (!settings?.announcement?.enabled) return null;

  const text = locale === 'ar' ? 
    (settings.announcement.text || "عروض حصرية على الوحدات السكنية في الرياض – خصومات لفترة محدودة") : 
    (settings.announcement.textEn || "Exclusive offers on residential units in Riyadh – Limited time discounts");

  return (
    <div className="announcement-bar" id="announcementBar" style={{ background: settings.announcement.color }}>
      <div className="announcement-track-wrapper">
        <div className="announcement-track-scrolling" style={{ animationDuration: `${settings.announcement.speed || 20}s` }}>
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
