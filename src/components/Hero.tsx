"use client";

import React, { useState, useEffect } from "react";
import { Building, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Hero = () => {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const [settings, setSettings] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`/api/settings?v=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
      });
  }, []);

  const hero = settings?.hero;
  let slides: any[] = [];

  if (hero?.slides && Array.isArray(hero.slides)) {
    slides = hero.slides.filter((s: any) => s && s.url && s.url.length > 5);
  }

  if (slides.length === 0) {
    slides = [{
      url: hero?.media || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
      type: hero?.mediaType || "image",
      title: hero?.title || "شركة خطوط الإنجاز للتطوير العقاري",
      subtitle: hero?.subtitle || "حلول عقارية متكاملة"
    }];
  }

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center bg-[#0f2339]">
      {/* BACKGROUND IMAGE - NO ANIMATION FOR DEBUGGING */}
      <div className="absolute inset-0 z-0">
        {slide?.type === 'video' ? (
          <video src={slide.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        ) : (
          <img 
            src={slide?.url} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80";
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 container mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {locale === 'ar' ? (slide?.title || hero?.title) : (slide?.titleEn || hero?.titleEn)}
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
          {locale === 'ar' ? (slide?.subtitle || hero?.subtitle) : (slide?.subtitleEn || hero?.subtitleEn)}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href={`/${locale}/sale`} className="bg-[#c9a227] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#b08e22]">
            <Building className="inline-block ml-2" size={20} />
            {locale === 'ar' ? 'عرض الوحدات' : 'View Units'}
          </Link>
          <Link href={`/${locale}/contact`} className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black">
            <Phone className="inline-block ml-2" size={20} />
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </div>
      </div>

      {/* INDICATORS */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-[#c9a227] w-10' : 'bg-white/40 w-2'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
