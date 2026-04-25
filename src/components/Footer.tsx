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
    phone1: "+966566066952", 
    phone2: "", 
    email: "info@khototalengaz.com",
    address: "الرياض، السعودية",
    addressEn: "Riyadh, Saudi Arabia",
    whatsapp: "966566066952"
  };
  const social = settings?.social || {};
  const sanitizedWhatsapp = contact.whatsapp?.replace(/\D/g, "") || "966566066952";

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
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {social.snapchat && (
                <a href={social.snapchat} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-snapchat-ghost"></i>
                </a>
              )}
              {social.tiktok && (
                <a href={social.tiktok} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-tiktok"></i>
                </a>
              )}
              <a href={`https://wa.me/${sanitizedWhatsapp}`} target="_blank" rel="noopener noreferrer">
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
              {/* Display Main Email */}
              <li>
                <a href={`mailto:${contact.email}`}>
                  <i className="fas fa-envelope"></i> {contact.email}
                </a>
              </li>
              {/* Display Additional Emails */}
              {contact.emails && contact.emails.map((email: string, idx: number) => email && (
                <li key={idx}>
                  <a href={`mailto:${email}`}>
                    <i className="fas fa-envelope"></i> {email}
                  </a>
                </li>
              ))}
              <li>
                <a href="#">
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  <span>{locale === 'ar' ? contact.address : (contact.addressEn || contact.address)}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p>{t.footer.rights}</p>
          <a href="https://wa.me/966541430116" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>
            {locale === 'ar' ? 'صمم بواسطة رواد الرقمية' : 'Designed by Rowad Digital'}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
