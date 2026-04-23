import React from "react";

const Stats = () => {
  const stats = [
    { value: "250+", label: "وحدات تم بيعها" },
    { value: "500+", label: "عميل سعيد" },
    { value: "15+", label: "مشروع منجز" },
    { value: "10+", label: "سنوات خبرة" },
  ];

  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-5xl md:text-7xl font-black mb-4 text-white transition-transform duration-500 group-hover:scale-110 group-hover:text-accent">
                {stat.value}
              </div>
              <div className="text-lg text-accent-light font-bold tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </div>
              <div className="w-12 h-1 bg-accent/30 mx-auto mt-6 rounded-full group-hover:w-20 group-hover:bg-accent transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
