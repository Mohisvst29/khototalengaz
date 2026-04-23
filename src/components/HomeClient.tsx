"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadModal from "./LeadModal";
import Counter from "./Counter";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

export default function HomeClient({ initialProperties, initialBlogs, settings }: any) {
  const [featuredProperties, setFeaturedProperties] = useState(initialProperties);
  const [latestBlogs, setLatestBlogs] = useState(initialBlogs);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  const hero = settings?.hero || {
    title: t.hero.title,
    titleEn: t.hero.title,
    subtitle: t.hero.subtitle,
    subtitleEn: t.hero.subtitle,
    media: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
    mediaType: "image"
  };

  useEffect(() => {
    // Re-fetch in client if needed or just use initial data
    if (initialProperties.length === 0) {
      fetch("/api/properties")
        .then((res) => res.json())
        .then((data) => setFeaturedProperties(data.slice(0, 3)))
        .catch(() => setFeaturedProperties([]));
    }

    if (initialBlogs.length === 0) {
      fetch("/api/blog")
        .then((res) => res.json())
        .then((data) => setLatestBlogs(data.slice(0, 3)))
        .catch(() => setLatestBlogs([]));
    }
  }, [initialProperties.length, initialBlogs.length]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = (settings?.hero?.slides && settings.hero.slides.length > 0) 
    ? settings.hero.slides 
    : [{ url: settings?.hero?.media || "/hero-bg.jpg", type: settings?.hero?.mediaType || "image" }];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="page active" id="page-home">
      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="hero">
        <div id="heroMediaContainer" className="hero-media-container">
          {slides.map((slide: any, index: number) => (
            <div 
              key={index} 
              className={`hero-media-item ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: index === currentSlide ? 1 : 0
              }}
            >
              {slide.type === 'video' ? (
                <video 
                  src={slide.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              ) : (
                <Image 
                  src={slide.url} 
                  alt={locale === 'ar' ? hero.title : hero.titleEn}
                  fill
                  priority={index === 0}
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                />
              )}
            </div>
          ))}
        </div>
        <div className="hero-overlay" style={{ zIndex: 2 }}></div>
        <div className="hero-content" style={{ zIndex: 3 }}>
          <div
            key={currentSlide}
            className="hero-text"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <h1>
              {locale === 'ar' 
                ? (slides[currentSlide]?.title || hero.title) 
                : (slides[currentSlide]?.titleEn || hero.titleEn)}
            </h1>
            <p>
              {locale === 'ar' 
                ? (slides[currentSlide]?.subtitle || hero.subtitle) 
                : (slides[currentSlide]?.subtitleEn || hero.subtitleEn)}
            </p>
            <div className="hero-buttons">
              <Link href={`/${locale}/sale`} className="btn btn-accent">
                <i className="fas fa-building"></i>
                <span>{t.hero.view_units}</span>
              </Link>
              <button className="btn btn-primary" onClick={() => setIsLeadModalOpen(true)}>
                <i className="fas fa-paper-plane"></i>
                <span>{t.hero.send_request}</span>
              </button>
              <Link href={`/${locale}/contact`} className="btn btn-outline-white">
                <i className="fas fa-phone"></i>
                <span>{t.hero.contact_us}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (3 Sections) */}
      {settings?.services?.some((s: any) => s.title || s.image) && (
        <section className="section">
          <div className="container">
            <div className="section-header" data-aos="fade-up">
              <h2>{locale === 'ar' ? 'خدماتنا المميزة' : 'Our Specialized Services'}</h2>
              <p>{locale === 'ar' ? 'نقدم حلولاً عقارية متكاملة تلبي احتياجاتكم' : 'We provide integrated real estate solutions to meet your needs'}</p>
            </div>
            <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {settings.services.map((service: any, idx: number) => (
                (service.title || service.titleEn) && (
                  <div key={idx} className="service-card-new" data-aos="fade-up" data-aos-delay={idx * 100} style={{ 
                    background: 'var(--white)', 
                    borderRadius: '15px', 
                    overflow: 'hidden', 
                    boxShadow: 'var(--shadow-md)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={service.image || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80`} 
                        alt={locale === 'ar' ? service.title : service.titleEn} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '25px', textAlign: 'center' }}>
                      <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '22px' }}>
                        {locale === 'ar' ? service.title : service.titleEn}
                      </h3>
                      <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                        {locale === 'ar' ? service.description : service.descriptionEn}
                      </p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="section" style={{ background: "var(--secondary)" }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>{t.home.why_choose_us}</h2>
            <p>{t.home.why_subtitle}</p>
          </div>
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>{t.features.experience}</h3>
              <p>{t.features.experience_desc}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>{t.features.trust}</h3>
              <p>{t.features.trust_desc}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">
                <i className="fas fa-th-large"></i>
              </div>
              <h3>{t.features.variety}</h3>
              <p>{t.features.variety_desc}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>{t.features.support}</h3>
              <p>{t.features.support_desc}</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="500">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>{t.features.speed}</h3>
              <p>{t.features.speed_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>{t.home.latest_units}</h2>
            <p>{t.home.latest_units_subtitle}</p>
          </div>
          <div
            className="properties-grid"
            id="featuredProperties"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {featuredProperties.map((p: any) => (
              <div key={p._id} className="property-card">
                <div className="property-image">
                  <img 
                    src={p.images?.[0] || p.image || "/placeholder-property.jpg"} 
                    alt={p.title} 
                    loading="lazy" 
                  />
                  <span className={`property-badge ${p.category === 'rent' ? 'rent' : ''}`}>
                    {p.category === 'sale' ? t.property.sale : t.property.rent}
                  </span>
                </div>
                <div className="property-content">
                  <div className="property-price">
                    {p.price?.toLocaleString()} {t.property.sar}
                  </div>
                  <h3 className="property-title">{p.title}</h3>
                  <div className="property-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {p.location}
                  </div>
                  <div className="property-meta">
                    <span>
                      <i className="fas fa-bed"></i> {p.rooms} {t.property.rooms}
                    </span>
                    <span>
                      <i className="fas fa-ruler-combined"></i> {p.area} {t.property.area}
                    </span>
                    <span>
                      <i className="fas fa-home"></i> {t.property[p.type] || p.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href={`/${locale}/sale`} className="btn btn-outline">
              <span>{t.home.view_all_units}</span>
              <i className={`fas fa-arrow-${locale === 'ar' ? 'left' : 'right'}`}></i>
            </Link>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="container">
          <div className="stats-row">
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="100">
              <Counter target={250} />
              <div className="stat-label">
                {t.stats.sold}
              </div>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="200">
              <Counter target={500} />
              <div className="stat-label">
                {t.stats.clients}
              </div>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="300">
              <Counter target={15} />
              <div className="stat-label">
                {t.stats.projects}
              </div>
            </div>
            <div className="stat-item" data-aos="zoom-in" data-aos-delay="400">
              <Counter target={10} />
              <div className="stat-label">
                {t.stats.years}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Section */}
      <section className="section" style={{ background: "var(--secondary)" }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>{t.home.latest_blog}</h2>
            <p>{t.home.blog_subtitle}</p>
          </div>
          <div className="properties-grid">
            {latestBlogs.map((post: any) => (
              <Link
                key={post._id}
                href={`/${locale}/blog/${post.slug}`}
                className="property-card"
                data-aos="fade-up"
              >
                <div className="property-image">
                  <img src={post.image} alt={post.title} loading="lazy" />
                  <span className="property-badge">{locale === 'ar' ? 'مقال' : 'Article'}</span>
                </div>
                <div className="property-content">
                  <div className="property-price" style={{ fontSize: "14px" }}>
                    {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? "ar-SA" : "en-US")}
                  </div>
                  <h3 className="property-title">{post.title}</h3>
                  <p
                    style={{
                      color: "var(--text-light)",
                      fontSize: "14px",
                      marginTop: "10px",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href={`/${locale}/blog`} className="btn btn-outline">
              <span>{t.home.view_all_posts}</span>
              <i className={`fas fa-arrow-${locale === 'ar' ? 'left' : 'right'}`}></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
