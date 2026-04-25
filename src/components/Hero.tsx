"use client";

import React from "react";
import { Building, Search, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

const Hero = () => {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const [settings, setSettings] = React.useState<any>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });
  }, []);

  const hero = settings?.hero || {
    title: "نطور مشاريع عقارية بمعايير حديثة",
    titleEn: "Developing real estate projects with modern standards",
    subtitle: "نوفر وحدات سكنية وتجارية للبيع والإيجار في أفضل مواقع المملكة.",
    subtitleEn: "We provide residential and commercial units for sale and rent in the best locations.",
    slides: [
      { 
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80", 
        type: "image",
        title: "", titleEn: "", subtitle: "", subtitleEn: ""
      }
    ]
  };

  const slides = hero.slides && hero.slides.length > 0 ? hero.slides : [
    { 
      url: hero.media || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80", 
      type: hero.mediaType || "image",
      title: hero.title, titleEn: hero.titleEn, subtitle: hero.subtitle, subtitleEn: hero.subtitleEn
    }
  ];

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden">
      {/* Slides Background */}
      <div className="absolute inset-0 z-0">
        {slides.map((s: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {s.type === 'video' ? (
              <video src={s.url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${s.url}')` }}
              />
            )}
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-[#0f2339]/65 z-10" />
      </div>

      <div className="relative z-20 max-w-[1200px] mx-auto px-6 w-full">
        <motion.div 
          key={currentSlide} // Key change triggers re-animation
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight">
            {(locale === 'ar' ? (slide.title || hero.title) : (slide.titleEn || hero.titleEn))}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-[800px] leading-relaxed">
            {(locale === 'ar' ? (slide.subtitle || hero.subtitle) : (slide.subtitleEn || hero.subtitleEn))}
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
