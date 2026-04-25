"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

export default function ServiceDetailClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const slug = params?.slug as string;
  const t = getTranslation(locale);
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });
  }, []);

  // Find service by slug from settings or fallback to translations
  let service: any = null;
  if (settings?.serviceList) {
    const s = settings.serviceList.find((item: any) => item.slug === slug);
    if (s) {
      service = {
        title: locale === 'ar' ? s.title : s.titleEn,
        desc: locale === 'ar' ? s.description : s.descriptionEn,
        image: s.image
      };
    }
  }

  if (!service) {
    const serviceKey = Object.keys(t.services.list).find(key => (t.services.list as any)[key].slug === slug);
    service = serviceKey ? (t.services.list as any)[serviceKey] : null;
  }

  if (!service) {
    return (
      <div className="section text-center">
        <div className="container">
          <h2>{locale === 'ar' ? 'الخدمة غير موجودة' : 'Service Not Found'}</h2>
          <Link href={`/${locale}/services`} className="btn btn-primary mt-4">
            {locale === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
        </div>
      </div>
    );
  }

  const defaultImages: any = {
    'residential-development': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    'building-restructuring': 'https://images.unsplash.com/photo-1503387762-592dee58c160?w=1200&q=80',
    'commercial-development': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    'project-management': 'https://images.unsplash.com/photo-1454165833762-02ad50c49771?w=1200&q=80',
    'real-estate-investment': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    'property-management': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    'sales-and-leasing': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&q=80',
  };

  const displayImage = service.image || defaultImages[slug] || defaultImages['residential-development'];

  return (
    <div className="page active">
      <div className="page-banner" style={{ padding: '80px 0' }}>
        <div className="container">
          <nav style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.8 }}>
            <Link href={`/${locale}`} style={{ color: 'white', textDecoration: 'none' }}>{t.nav.home}</Link> / 
            <Link href={`/${locale}/services`} style={{ color: 'white', textDecoration: 'none', margin: '0 5px' }}>{t.nav.services}</Link> / 
            <span style={{ margin: '0 5px' }}>{service.title}</span>
          </nav>
          <h1 data-aos="fade-up" style={{ fontSize: '36px' }}>{service.title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="service-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'start' }}>
            <div className="service-main-content" data-aos="fade-right">
              <div className="detail-image" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', boxShadow: 'var(--shadow-lg)' }}>
                <img src={displayImage} alt={service.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <h2 style={{ color: 'var(--primary)', marginBottom: '25px', fontSize: '28px', fontWeight: '800' }}>
                {locale === 'ar' ? 'نظرة عامة على الخدمة' : 'Service Overview'}
              </h2>
              <div style={{ fontSize: '18px', lineHeight: '2', color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                <p>{service.desc}</p>
                <p style={{ marginTop: '20px' }}>
                  {locale === 'ar' 
                    ? `نحن في شركة خطوط الإنجاز نولي اهتماماً خاصاً لخدمة ${service.title}، حيث نجمع بين الخبرة العميقة والفهم الدقيق للسوق العقاري لتقديم أفضل النتائج لعملائنا.`
                    : `At Khotot Al-Engaz, we pay special attention to the ${service.title} service, where we combine deep expertise with a precise understanding of the real estate market to deliver the best results for our clients.`}
                </p>
              </div>
            </div>

            <div className="service-sidebar" data-aos="fade-left">
              <div className="sidebar-box" style={{ background: 'var(--primary)', color: 'white', padding: '30px', borderRadius: '20px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--accent)' }}>
                  {locale === 'ar' ? 'اطلب الخدمة الآن' : 'Request Service Now'}
                </h3>
                <p style={{ marginBottom: '25px', opacity: 0.9 }}>
                  {locale === 'ar' 
                    ? 'فريقنا جاهز للرد على استفساراتكم وتقديم الاستشارات اللازمة.' 
                    : 'Our team is ready to answer your inquiries and provide necessary consultations.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <a href={`https://wa.me/${settings?.contact?.whatsapp || "966566066952"}?text=${encodeURIComponent(locale === 'ar' ? `استفسار عن خدمة ${service.title}` : `Inquiry about ${service.title} service`)}`} className="btn btn-whatsapp" style={{ justifyContent: 'center' }}>
                    <i className="fab fa-whatsapp"></i>
                    {locale === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                  </a>
                  <Link href={`/${locale}/contact`} className="btn btn-outline-white" style={{ justifyContent: 'center' }}>
                    <i className="fas fa-envelope"></i>
                    {locale === 'ar' ? 'أرسل بريداً إلكترونياً' : 'Send an Email'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
