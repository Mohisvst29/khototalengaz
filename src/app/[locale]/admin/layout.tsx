"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
LayoutDashboard,
Building2,
Briefcase,
Settings,
LogOut,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";

export default function AdminLayout({
children,
}: {
children: React.ReactNode;
}) {
const pathname = usePathname();
const params = useParams();

const locale = (params?.locale as string) || "ar";

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
<div
className="min-h-screen bg-[#f3f4f6] flex flex-row-reverse"
dir={locale === "ar" ? "rtl" : "ltr"}
>
{/* Sidebar */} <aside className="hidden lg:flex flex-col w-[260px] bg-[#0f2339] text-white fixed right-0 h-full z-30">
{/* Logo */} <div className="p-6 border-b border-white/5 flex justify-center"> <Image
         src="/logo.png"
         alt="Admin"
         width={120}
         height={50}
         className="h-[45px] w-auto object-contain bg-white rounded p-1"
       /> </div>

```
    {/* Navigation */}
    <nav className="flex-1 py-4 flex flex-col">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-6 py-4 transition-all ${
              isActive
                ? "bg-[#1a3a5c] border-r-4 border-[#c9a227] text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-bold text-[14px]">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="p-4 border-t border-white/5">
      <Link
        href={`/${locale}`}
        className="flex items-center gap-3 px-6 py-4 text-gray-400 hover:text-white transition-colors"
      >
        <LogOut size={18} />
        <span className="font-bold text-[14px]">
          تسجيل الخروج
        </span>
      </Link>
    </div>
  </aside>

  {/* Main */}
  <main className="flex-1 lg:pr-[260px] min-h-screen">
    {/* Header */}
    <header className="bg-white border-b border-gray-200 h-[64px] flex items-center justify-between px-8 sticky top-0 z-20">
      <h1 className="text-[18px] font-bold text-[#0f2339]">
        لوحة التحكم
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-left">
          <p className="text-sm font-bold text-[#0f2339]">
            مدير النظام
          </p>
          <p className="text-xs text-gray-500">
            admin@khotot.com
          </p>
        </div>

        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#0f2339] font-bold">
          AD
        </div>
      </div>
    </header>

    {/* Content */}
    <div className="p-8">{children}</div>
  </main>
</div>
```

);
}
