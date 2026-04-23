"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

const Footer = () => {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });
  }, []);

  const branding = settings?.branding || { logo: "/logo.png", logoSize: 60 };
  const contact = settings?.contact || { 
    phone1: "+966567337666", 
    phone2: "+966566066952", 
    email: "info@khototalengaz.com",
    address: "الرياض، السعودية",
    addressEn: "Riyadh, Saudi Arabia",
    whatsapp: "966567337666"
  };

  return (
    <footer className="footer" id="mainFooter">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={`/${locale}`}>
              <img
                src={branding.logo}
                alt="Logo"
                className="site-logo"
                style={{
                  height: `${branding.logoSize}px`,
                  objectFit: "contain",
                  marginBottom: "15px",
                  background: "white",
                  borderRadius: "8px",
                  padding: "5px",
                }}
              />
            </Link>
            <p data-key="footer_desc">{t.footer.desc}</p>
            <div className="footer-social">
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href={`https://wa.me/${contact.whatsapp}`}>
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h4 data-key="quick_links">{t.footer.quick_links}</h4>
            <ul className="footer-links">
              <li>
                <Link href={`/${locale}`}>{t.nav.home}</Link>
              </li>
              <li>
                <Link href={`/${locale}/about`}>{t.nav.about}</Link>
              </li>
              <li>
                <Link href={`/${locale}/sale`}>{t.nav.sale}</Link>
              </li>
              <li>
                <Link href={`/${locale}/rent`}>{t.nav.rent}</Link>
              </li>
              <li>
                <Link href={`/${locale}/projects`}>{t.nav.projects}</Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`}>{t.nav.blog}</Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 data-key="contact_us">{t.footer.contact_info}</h4>
            <ul className="footer-links">
              <li>
                <a href={`tel:${contact.phone1}`}>
                  <i className="fas fa-phone"></i> {contact.phone1}
                </a>
              </li>
              {contact.phone2 && (
                <li>
                  <a href={`tel:${contact.phone2}`}>
                    <i className="fas fa-phone"></i> {contact.phone2}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${contact.email}`}>
                  <i className="fas fa-envelope"></i> {contact.email}
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  <span>{locale === 'ar' ? contact.address : (contact.addressEn || contact.address)}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
