"use client";

import React from "react";
import { Building, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const [settings, setSettings] = React.useState<any>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`/api/settings?v=${Date.now()}`);
        const data = await res.json();
        if (!data.error) setSettings(data);
      } catch (err) {
        console.error("Hero error", err);
      }
    };
    loadSettings();
  }, []);

  const slides = React.useMemo(() => {
    const hero = settings?.hero;
    let list = [];
    
    // 1. Array from settings
    if (hero?.slides && Array.isArray(hero.slides) && hero.slides.length > 0) {
      list = hero.slides.filter((s: any) => s && s.url && s.url.trim() !== "");
    }
    
    // 2. Fallback to main media OR default image
    if (list.length === 0) {
      list.push({
        url: (hero?.media && hero.media.trim() !== "") ? hero.media : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
        type: hero?.mediaType || "image",
        title: hero?.title || "شركة خطوط الإنجاز للتطوير العقاري",
        titleEn: hero?.titleEn || "Khotot Al-Engaz Real Estate Development",
        subtitle: hero?.subtitle || "حلول عقارية متكاملة تلبي احتياجاتكم",
        subtitleEn: hero?.subtitleEn || "Integrated real estate solutions"
      });
    }
    
    return list;
  }, [settings]);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden bg-[#0f2339]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {slide.type === 'video' ? (
              <video src={slide.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={slide.url} alt="" className="w-full h-full object-cover" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#0f2339]/60 z-10" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 container mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
              {locale === 'ar' ? (slide.title || settings?.hero?.title) : (slide.titleEn || settings?.hero?.titleEn)}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl drop-shadow-sm">
              {locale === 'ar' ? (slide.subtitle || settings?.hero?.subtitle) : (slide.subtitleEn || settings?.hero?.subtitleEn)}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href={`/${locale}/sale`} className="bg-[#c9a227] text-[#0f2339] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#b08e22] transition-colors">
                <Building className="inline-block ml-2" size={20} /> {locale === 'ar' ? 'عرض الوحدات' : 'View Units'}
              </Link>
              <Link href={`/${locale}/contact`} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-colors">
                <Phone className="inline-block ml-2" size={20} /> {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DOTS */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_: any, idx: number) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-[#c9a227] w-10' : 'bg-white/40 w-2'}`} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
