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

  React.useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });
  }, []);

  const hero = settings?.hero || {
    title: "نطور مشاريع عقارية بمعايير حديثة",
    titleEn: "Developing real estate projects with modern standards",
    subtitle: "نوفر وحدات سكنية وتجارية للبيع والإيجار في أفضل مواقع المملكة. نجمع بين الجودة العالية والموقع المتميز والسعر التنافسي.",
    subtitleEn: "We provide residential and commercial units for sale and rent in the best locations of the Kingdom. We combine high quality, distinguished location and competitive price.",
    media: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
    mediaType: "image"
  };

  return (
    <section className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {hero.mediaType === 'video' ? (
          <video src={hero.media} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${hero.media}')` }}
          />
        )}
        <div className="absolute inset-0 bg-[#0f2339]/70 z-10" />
      </div>

      <div className="relative z-20 max-w-[1200px] mx-auto px-6 w-full">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight">
            {locale === 'ar' ? hero.title : hero.titleEn}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-[800px] leading-relaxed">
            {locale === 'ar' ? hero.subtitle : hero.subtitleEn}
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
              href={`/${locale}/sale`} 
              className="bg-[#0f2339] hover:bg-[#1a3a5c] text-white px-10 py-4 rounded-md font-bold text-lg flex items-center gap-3 transition-all border border-[#1a3a5c]"
            >
              <Search size={22} />
              {locale === 'ar' ? 'ابحث عن عقارك' : 'Find Property'}
            </Link>

            <Link 
              href={`/${locale}/contact`} 
              className="border-2 border-white text-white hover:bg-white hover:text-[#0f2339] px-10 py-4 rounded-md font-bold text-lg flex items-center gap-3 transition-all"
            >
              <Phone size={22} />
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
