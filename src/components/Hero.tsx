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
        if (!data.error) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Hero load error", err);
      }
    };
    loadSettings();
  }, []);

  // Simplified slide derivation
  const getHeroSlides = () => {
    if (!settings?.hero) return [];
    
    let list = [];
    
    // 1. Check slides array
    if (Array.isArray(settings.hero.slides) && settings.hero.slides.length > 0) {
      list = settings.hero.slides.filter((s: any) => s && s.url);
    }
    
    // 2. Add main media as a slide if list is still empty
    if (list.length === 0) {
      list.push({
        url: settings.hero.media || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
        type: settings.hero.mediaType || "image",
        title: settings.hero.title,
        titleEn: settings.hero.titleEn,
        subtitle: settings.hero.subtitle,
        subtitleEn: settings.hero.subtitleEn
      });
    }
    
    return list;
  };

  const slides = getHeroSlides();

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0] || {};

  // If no data yet, show a placeholder to avoid empty screen
  if (!slide.url && !settings) return (
    <div className="h-screen bg-[#0f2339] flex items-center justify-center">
      <div className="text-white">جاري التحميل...</div>
    </div>
  );

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden bg-[#0f2339]">
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.url + currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {slide.type === 'video' ? (
              <video src={slide.url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${slide.url}')` }} />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {locale === 'ar' ? (slide.title || settings?.hero?.title) : (slide.titleEn || settings?.hero?.titleEn)}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl">
              {locale === 'ar' ? (slide.subtitle || settings?.hero?.subtitle) : (slide.subtitleEn || settings?.hero?.subtitleEn)}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href={`/${locale}/sale`} className="bg-[#c9a227] text-[#0f2339] px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all">
                <Building className="inline-block ml-2" size={20} /> {locale === 'ar' ? 'عرض الوحدات' : 'View Units'}
              </Link>
              <Link href={`/${locale}/contact`} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all">
                <Phone className="inline-block ml-2" size={20} /> {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-[#c9a227] w-10' : 'bg-white/40 w-2'}`} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
