import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "ar"; // مؤقت

  const navItems = [
    {
      name: "لوحة التحكم",
      path: `/${locale}/admin`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "إدارة العقارات",
      path: `/${locale}/admin/properties`,
      icon: <Building2 size={20} />,
    },
    {
      name: "إدارة المشاريع",
      path: `/${locale}/admin/projects`,
      icon: <Briefcase size={20} />,
    },
    {
      name: "الإعدادات",
      path: `/${locale}/admin/settings`,
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-row-reverse" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#0f2339] text-white fixed right-0 h-full z-30">
        <div className="p-6 border-b border-white/5 flex justify-center">
          <Image
            src="/logo.png"
            alt="Admin"
            width={120}
            height={50}
            className="h-[45px] w-auto object-contain bg-white rounded p-1"
          />
        </div>

        <nav className="flex-1 py-4 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-6 py-4 text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {item.icon}
              <span className="font-bold text-[14px]">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/ar"
            className="flex items-center gap-3 px-6 py-4 text-gray-300 hover:text-white"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:pr-[260px] min-h-screen">
        <header className="bg-white border-b border-gray-200 h-[64px] flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-[18px] font-bold text-[#0f2339]">
            لوحة التحكم
          </h1>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
