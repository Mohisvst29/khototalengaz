"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Building, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const [settings, setSettings] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/settings?v=${Date.now()}`);
        const data = await res.json();
        if (!data.error) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Hero: Settings fetch failed", err);
      }
    };
    fetchSettings();
  }, []);

  const slides = useMemo(() => {
    const hero = settings?.hero;
    let list: any[] = [];

    // 1. Check slides array from DB
    if (hero?.slides && Array.isArray(hero.slides) && hero.slides.length > 0) {
      list = hero.slides.filter((s: any) => s && s.url && s.url.trim().length > 2);
    }

    // 2. Fallback to main media if slides list is empty
    if (list.length === 0) {
      list = [{
        url: (hero?.media && hero.media.length > 2) ? hero.media : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
        type: hero?.mediaType || "image",
        title: hero?.title || "شركة خطوط الإنجاز للتطوير العقاري",
        titleEn: hero?.titleEn || "Khotot Al-Engaz Real Estate Development",
        subtitle: hero?.subtitle || "نحن هنا لنساعدك في العثور على بيت أحلامك",
        subtitleEn: hero?.subtitleEn || "We are here to help you find your dream home"
      }];
    }

    return list;
  }, [settings]);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    } else {
      setCurrentSlide(0);
    }
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden bg-[#0f2339]">
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slide?.url || 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
          >
            {slide?.type === 'video' ? (
              <video 
                src={slide.url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover" 
              />
            ) : (
              <img 
                src={slide?.url} 
                alt="Background" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Image load error:", slide?.url);
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80";
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-20 container mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-xl">
              {locale === 'ar' ? (slide?.title || settings?.hero?.title) : (slide?.titleEn || settings?.hero?.titleEn)}
            </h1>
            
            <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-4xl leading-relaxed drop-shadow-lg">
              {locale === 'ar' ? (slide?.subtitle || settings?.hero?.subtitle) : (slide?.subtitleEn || settings?.hero?.subtitleEn)}
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
              <Link 
                href={`/${locale}/sale`} 
                className="bg-[#c9a227] hover:bg-[#b08e22] text-[#0f2339] px-10 py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl"
              >
                <Building className="inline-block ml-2 mb-1" size={24} />
                {locale === 'ar' ? 'عرض الوحدات' : 'View Units'}
              </Link>
              
              <Link 
                href={`/${locale}/contact`} 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white px-10 py-4 rounded-xl font-bold text-xl transition-all hover:scale-105"
              >
                <Phone className="inline-block ml-2 mb-1" size={24} />
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* INDICATORS (DOTS) */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                currentSlide === idx ? 'bg-[#c9a227] w-12' : 'bg-white/30 w-2.5 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
