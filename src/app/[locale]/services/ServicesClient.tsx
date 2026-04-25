"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

export default function ServicesClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });
  }, []);

  const defaultIcons: any = {
    'residential-development': 'fa-home',
    'building-restructuring': 'fa-tools',
    'commercial-development': 'fa-building',
    'project-management': 'fa-tasks',
    'real-estate-investment': 'fa-chart-pie',
    'property-management': 'fa-key',
    'sales-and-leasing': 'fa-handshake',
  };

  const services = (settings?.serviceList && settings.serviceList.length > 0) 
    ? settings.serviceList.map((s: any) => ({
        ...s,
        title: locale === 'ar' ? s.title : s.titleEn,
        desc: locale === 'ar' ? s.description : s.descriptionEn,
        icon: defaultIcons[s.slug] || 'fa-star',
        img: s.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'
      }))
    : [
      { key: 'residential', slug: 'residential-development', icon: 'fa-home', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
      { key: 'restructuring', slug: 'building-restructuring', icon: 'fa-tools', img: 'https://images.unsplash.com/photo-1503387762-592dee58c160?w=800&q=80' },
      { key: 'commercial', slug: 'commercial-development', icon: 'fa-building', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
      { key: 'management', slug: 'project-management', icon: 'fa-tasks', img: 'https://images.unsplash.com/photo-1454165833762-02ad50c49771?w=800&q=80' },
      { key: 'investment', slug: 'real-estate-investment', icon: 'fa-chart-pie', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' },
      { key: 'property_mgmt', slug: 'property-management', icon: 'fa-key', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80' },
      { key: 'sales_leasing', slug: 'sales-and-leasing', icon: 'fa-handshake', img: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80' },
    ].map(s => {
      const data = (t.services.list as any)[s.key];
      return { ...s, ...data };
    });

  return (
    <div className="page active" id="page-services">
      <div className="page-banner">
        <div className="container">
          <h1 data-aos="fade-up">{t.services.title}</h1>
          <p data-aos="fade-up" data-aos-delay="100">{t.services.subtitle}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {services.map((service, index) => {
              const data = t.services.list[service.key];
              return (
                <div 
                  key={service.key} 
                  className="service-card-full" 
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                  style={{
                    background: 'var(--white)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--border)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="service-img-wrapper" style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={service.img} 
                      alt={data.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="service-icon-badge" style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      width: '50px',
                      height: '50px',
                      background: 'var(--primary)',
                      color: 'var(--accent)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <i className={`fas ${service.icon}`}></i>
                    </div>
                  </div>
                  <div className="service-body" style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)', marginBottom: '15px' }}>
                      {data.title}
                    </h3>
                    <p style={{ color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '20px', fontSize: '15px' }}>
                      {data.desc}
                    </p>
                    <Link 
                      href={`/${locale}/services/${data.slug}`} 
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
