"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import FloatingWhatsApp from "./FloatingWhatsApp";
import AOSInit from "./AOSInit";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  return (
    <>
      <AOSInit />
      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Header />}
      <main id={isAdmin ? "" : "mainContent"}>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWhatsApp />}
    </>
  );
}
