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
        const res = await fetch("/api/settings", { cache: 'no-store' });
        const data = await res.json();
        if (!data.error) {
          console.log("Hero settings loaded:", data.hero);
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    loadSettings();
  }, []);

  // Prepare slides with all possible fallbacks
  const getSlides = () => {
    const hero = settings?.hero;
    let slidesList = [];

    if (hero?.slides && hero.slides.length > 0) {
      // Use slides from settings if they exist and have URLs
      slidesList = hero.slides.filter((s: any) => s.url);
    }

    // If no slides found in the array, fall back to the main hero media
    if (slidesList.length === 0) {
      slidesList = [{
        url: hero?.media || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
        type: hero?.mediaType || "image",
        title: hero?.title || "خطوط الإنجاز للتطوير العقاري",
        titleEn: hero?.titleEn || "Khotot Al-Engaz Real Estate Development",
        subtitle: hero?.subtitle || "نطور مشاريع عقارية بمعايير حديثة",
        subtitleEn: hero?.subtitleEn || "Developing real estate projects with modern standards"
      }];
    }

    return slidesList;
  };

  const slides = getSlides();

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden bg-[#0f2339]">
      {/* Slides Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {slide.type === 'video' ? (
              <video 
                src={slide.url} 
                autoPlay 
                loop 
                muted 
                playsInline 
                key={slide.url}
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
        <div className="absolute inset-0 bg-[#0f2339]/60 z-10" />
      </div>

      <div className="relative z-20 max-w-[1200px] mx-auto px-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`text-${currentSlide}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight">
              {locale === 'ar' ? (slide.title || settings?.hero?.title) : (slide.titleEn || settings?.hero?.titleEn)}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-[800px] leading-relaxed">
              {locale === 'ar' ? (slide.subtitle || settings?.hero?.subtitle) : (slide.subtitleEn || settings?.hero?.subtitleEn)}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href={`/${locale}/sale`} 
                className="bg-[#c9a227] hover:bg-[#b08e22] text-[#0f2339] px-10 py-4 rounded-md font-bold text-lg flex items-center gap-3 transition-all"
              >
                <Building size={22} />
                {locale === 'ar' ? 'عرض الوحدات' : 'View Units'}
              </Link>
              
              <Link 
                href={`/${locale}/contact`} 
                className="border-2 border-white text-white hover:bg-white hover:text-[#0f2339] px-10 py-4 rounded-md font-bold text-lg flex items-center gap-3 transition-all"
              >
                <Phone size={22} />
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-[#c9a227] w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
