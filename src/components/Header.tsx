"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navLinks = [
    { name: t.nav.home, path: `/${locale}` },
    { name: t.nav.about, path: `/${locale}/about` },
    { 
      name: t.nav.services, 
      path: `/${locale}/services`,
      dropdown: (settings?.serviceList && settings.serviceList.length > 0) 
        ? settings.serviceList.map((s: any) => ({
            name: locale === 'ar' ? s.title : s.titleEn,
            path: `/${locale}/services/${s.slug}`
          }))
        : [
          { name: t.services.list.residential.title, path: `/${locale}/services/residential-development` },
          { name: t.services.list.restructuring.title, path: `/${locale}/services/building-restructuring` },
          { name: t.services.list.commercial.title, path: `/${locale}/services/commercial-development` },
          { name: t.services.list.management.title, path: `/${locale}/services/project-management` },
          { name: t.services.list.investment.title, path: `/${locale}/services/real-estate-investment` },
          { name: t.services.list.property_mgmt.title, path: `/${locale}/services/property-management` },
          { name: t.services.list.sales_leasing.title, path: `/${locale}/services/sales-and-leasing` },
        ]
    },
    { name: t.nav.sale, path: `/${locale}/sale` },
    { name: t.nav.rent, path: `/${locale}/rent` },
    { name: t.nav.projects, path: `/${locale}/projects` },
    { name: t.nav.blog, path: `/${locale}/blog` },
    { name: t.nav.contact, path: `/${locale}/contact` },
  ];

  const switchLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  const branding = settings?.branding || { logo: "/logo.png", logoSize: 60 };
  const contact = settings?.contact || { whatsapp: "966567337666" };
  const announcement = settings?.announcement || { enabled: true, text: "", textEn: "", color: "#1a3a5c", speed: 30 };

  const sanitizedWhatsapp = contact.whatsapp?.replace(/\D/g, "") || "966567337666";

  return (
    <>
      <header className={`header ${isScrolled ? "scrolled" : ""}`} id="header">
        <div className="header-inner">
          <Link href={`/${locale}`} className="logo">
            <img
              src={branding.logo}
              alt="Logo"
              className="site-logo"
              style={{ height: `${branding.logoSize}px`, objectFit: "contain" }}
            />
          </Link>
          <nav className="nav-desktop" id="navDesktop">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div key={link.path} className="nav-item-dropdown">
                  <Link
                    href={link.path}
                    className={`nav-link ${pathname.includes(link.path) ? "active" : ""}`}
                  >
                    {link.name} <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginRight: '5px' }}></i>
                  </Link>
                  <div className="dropdown-menu">
                    {link.dropdown.map((sub) => (
                      <Link key={sub.path} href={sub.path} className="dropdown-item">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`nav-link ${pathname === link.path ? "active" : ""}`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>
          <div className="header-actions">
            <button className="lang-switch" id="langSwitch" onClick={switchLanguage}>
              {locale === "ar" ? "EN" : "عربي"}
            </button>
            <a
              href={`https://wa.me/${sanitizedWhatsapp}`}
              target="_blank"
              className="btn btn-whatsapp"
            >
              <i className="fab fa-whatsapp"></i>
              <span>{locale === "ar" ? "واتساب" : "WhatsApp"}</span>
            </a>
          </div>
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </header>

      <div
        className={`mobile-overlay ${isMenuOpen ? "open" : ""}`}
        id="mobileOverlay"
        onClick={toggleMobileMenu}
      ></div>
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`} id="mobileMenu">
        {navLinks.map((link) => (
          link.dropdown ? (
            <div key={link.path}>
              <button 
                className="mobile-dropdown-btn" 
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                {link.name}
                <i className={`fas fa-chevron-${isServicesOpen ? 'up' : 'down'}`}></i>
              </button>
              <div className={`mobile-dropdown-content ${isServicesOpen ? 'open' : ''}`}>
                {link.dropdown.map((sub) => (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    className="mobile-dropdown-item"
                    onClick={toggleMobileMenu}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={link.path}
              href={link.path}
              className="mobile-nav-link"
              onClick={toggleMobileMenu}
            >
              {link.name}
            </Link>
          )
        ))}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "24px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <a
            href={`https://wa.me/${sanitizedWhatsapp}`}
            target="_blank"
            className="btn btn-whatsapp"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <i className="fab fa-whatsapp"></i>
            {locale === "ar" ? "واتساب" : "WhatsApp"}
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
