"use client";
import React from "react";
import { ChartLine, ShieldCheck, LayoutGrid, Headset, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <ChartLine size={32} />,
      title: "خبرة في السوق السعودي",
      desc: "نمتلك خبرة عميقة في السوق العقاري السعودي وفهم تام لاحتياجات العملاء",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "الالتزام بالمصداقية",
      desc: "نلتزم بأعلى معايير الشفافية والمصداقية في جميع تعاملاتنا",
    },
    {
      icon: <LayoutGrid size={32} />,
      title: "تنوع في الخيارات",
      desc: "نوفر تشكيلة واسعة من الوحدات السكنية والتجارية لتناسب جميع الاحتياجات",
    },
    {
      icon: <Headset size={32} />,
      title: "دعم كامل للعملاء",
      desc: "فريق متخصص جاهز لمساعدتك في كل خطوة من خطوات اختيار العقار المناسب",
    },
    {
      icon: <Zap size={32} />,
      title: "سرعة في التنفيذ",
      desc: "نحرص على إنجاز جميع المعاملات بسرعة وكفاءة عالية",
    },
  ];

  return (
    <section className="py-32 bg-secondary/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-6 py-2 bg-primary/5 rounded-full mb-6 border border-primary/10">
            <span className="text-primary font-black uppercase tracking-widest text-sm">مميزاتنا</span>
          </div>
          <h2 className="text-5xl font-black text-primary mb-6">لماذا تختار خطوط الإنجاز؟</h2>
          <p className="text-xl text-text-light max-w-3xl mx-auto leading-relaxed">نقدم منظومة متكاملة من الخدمات العقارية التي تضمن لعملائنا أعلى مستويات الجودة والراحة في اتخاذ القرار الاستثماري الصحيح.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] text-center border border-border/40 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-primary/5 group"
            >
              <div className="w-20 h-20 bg-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-accent group-hover:rotate-6 group-hover:scale-110 shadow-lg shadow-primary/5">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-primary mb-5 group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-text-light text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
