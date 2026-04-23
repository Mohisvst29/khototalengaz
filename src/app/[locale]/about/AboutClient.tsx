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
      if (!data.error) setSettings(data);
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
              <h2>
                {t.about.company}
              </h2>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                <p>
                  {locale === 'ar' ? about.content : (about.contentEn || about.content)}
                </p>
              </div>
              <ul className="about-list">
                <li>
                  <i className="fas fa-check-circle"></i>{" "}
                  <span>{t.features.experience}</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>{" "}
                  <span>{t.features.trust}</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>{" "}
                  <span>{t.features.variety}</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>{" "}
                  <span>{t.features.support}</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>{" "}
                  <span>{t.features.speed}</span>
                </li>
              </ul>
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
