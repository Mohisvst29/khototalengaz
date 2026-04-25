"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

export default function AboutClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) {
        setSettings(data);
        // Refresh animations after dynamic content loads
        setTimeout(() => {
          const AOS = require("aos");
          AOS.refresh();
        }, 500);
      }
    });
  }, []);

  const about = settings?.about || {
    content: t.about.desc1 + "\n\n" + t.about.desc2,
    contentEn: t.about.desc1 + "\n\n" + t.about.desc2,
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"]
  };

  return (
    <div className="page active" id="page-about">
      <div className="page-banner">
        <div className="container">
          <h1 data-aos="fade-up">
            {t.about.title}
          </h1>
          <p data-aos="fade-up" data-aos-delay="100">
            {t.about.subtitle}
          </p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="about-content">
            <div className="about-image" data-aos={locale === 'ar' ? 'fade-left' : 'fade-right'}>
              <img
                src={about.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
                alt="About Us"
              />
            </div>
            <div className="about-text" data-aos={locale === 'ar' ? 'fade-right' : 'fade-left'}>
              <h2 className="mb-6">
                {t.about.company}
              </h2>
              <div className="about-description space-y-6">
                <p className="text-lg leading-relaxed">
                  {t.about.desc1}
                </p>
                
                <div className="bullets-container">
                  <p className="font-bold mb-4">{t.about.desc2}</p>
                  <ul className="about-list">
                    {t.about.bullets?.map((bullet: string, index: number) => (
                      <li key={index} className="flex items-center gap-3 mb-3">
                        <i className="fas fa-check-circle text-primary text-xl"></i>{" "}
                        <span className="text-gray-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="italic font-medium text-primary py-4 border-y border-gray-100 my-6">
                  {t.about.closing}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="vision-mission-box p-6 bg-gray-50 rounded-2xl border border-gray-100" data-aos="fade-up">
                    <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-3">
                      <i className="fas fa-eye"></i>
                      {t.about.vision_title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t.about.vision_desc}
                    </p>
                  </div>
                  <div className="vision-mission-box p-6 bg-gray-50 rounded-2xl border border-gray-100" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-3">
                      <i className="fas fa-bullseye"></i>
                      {t.about.mission_title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t.about.mission_desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {about.images?.length > 1 && (
            <div className="gallery-grid mt-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '60px' }}>
              {about.images.slice(1).map((img: string, idx: number) => (
                <div key={idx} style={{ height: '250px', borderRadius: '12px', overflow: 'hidden' }} data-aos="zoom-in">
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
