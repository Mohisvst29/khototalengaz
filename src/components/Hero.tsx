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
        // Use a timestamp to force fresh data from server/proxy
        const res = await fetch(`/api/settings?v=${Date.now()}`, { 
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();
        if (!data.error) setSettings(data);
      } catch (err) {
        console.error("Hero: Failed to load settings", err);
      }
    };
    loadSettings();
  }, []);

  // Simplified slide generation
  const slides = React.useMemo(() => {
    const hero = settings?.hero;
    const list: any[] = [];

    // 1. Add slides from the dedicated array
    if (hero?.slides && Array.isArray(hero.slides)) {
      hero.slides.forEach((s: any) => {
        if (s && s.url) list.push(s);
      });
    }

    // 2. Fallback to main media if list is empty
    if (list.length === 0) {
      list.push({
        url: hero?.media || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
        type: hero?.mediaType || "image",
        title: hero?.title || "خطوط الإنجاز للتطوير العقاري",
        titleEn: hero?.titleEn || "Khotot Al-Engaz Real Estate Development",
        subtitle: hero?.subtitle || "نطور مشاريع عقارية بمعايير حديثة",
        subtitleEn: hero?.subtitleEn || "Developing real estate projects with modern standards"
      });
    }

    return list;
  }, [settings]);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden bg-[#0f2339]">
      {/* Background Images/Videos */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={`bg-${currentSlide}-${slide.url}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            {slide.type === 'video' ? (
              <video 
                src={slide.url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.url}')` }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`content-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {locale === 'ar' ? (slide.title || settings?.hero?.title) : (slide.titleEn || settings?.hero?.titleEn)}
            </h1>
            
            <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl leading-relaxed drop-shadow-md">
              {locale === 'ar' ? (slide.subtitle || settings?.hero?.subtitle) : (slide.subtitleEn || settings?.hero?.subtitleEn)}
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
              <Link 
                href={`/${locale}/sale`} 
                className="bg-[#c9a227] hover:bg-[#b08e22] text-[#0f2339] px-8 py-4 rounded-lg font-bold text-lg shadow-xl transition-all hover:scale-105"
              >
                <Building className="inline-block ml-2 mb-1" size={20} />
                {locale === 'ar' ? 'عرض الوحدات' : 'View Units'}
              </Link>
              
              <Link 
                href={`/${locale}/contact`} 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              >
                <Phone className="inline-block ml-2 mb-1" size={20} />
                {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators (Dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'bg-[#c9a227] w-10' : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
