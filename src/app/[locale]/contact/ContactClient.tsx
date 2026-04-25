"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import { toast } from "react-toastify";

export default function ContactClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (!data.error) setSettings(data);
    });
  }, []);

  const contactInfo = settings?.contact || {
    phone1: "+966566066952",
    phone2: "",
    email: "info@khototalengaz.com",
    address: "الرياض، المملكة العربية السعودية",
    addressEn: "Riyadh, Saudi Arabia",
    whatsapp: "966566066952",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.356!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(locale === 'ar' ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.error(locale === 'ar' ? "حدث خطأ أثناء الإرسال." : "Error sending message.");
      }
    } catch (error) {
      toast.error(locale === 'ar' ? "خطأ في الاتصال." : "Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="page-contact">
      <div className="page-banner">
        <div className="container">
          <h1>{t.contact.title}</h1>
          <p>{t.contact.subtitle}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>{t.contact.info_title}</h3>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>{locale === 'ar' ? 'اتصل بنا' : 'Call Us'}</h4>
                  <a href={`tel:${contactInfo.phone1}`}>{contactInfo.phone1}</a>
                  {contactInfo.phone2 && (
                    <>
                      <br />
                      <a href={`tel:${contactInfo.phone2}`}>{contactInfo.phone2}</a>
                    </>
                  )}
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>{t.contact.email}</h4>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                  {contactInfo.emails && contactInfo.emails.map((email: string, idx: number) => email && (
                    <React.Fragment key={idx}>
                      <br />
                      <a href={`mailto:${email}`}>{email}</a>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>{locale === 'ar' ? 'الموقع' : 'Location'}</h4>
                  <span>{locale === 'ar' ? contactInfo.address : (contactInfo.addressEn || contactInfo.address)}</span>
                </div>
              </div>
              <div className="contact-item">
                <i className="fab fa-whatsapp"></i>
                <div>
                  <h4>WhatsApp</h4>
                  <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">+{contactInfo.whatsapp}</a>
                </div>
              </div>
              <form style={{ marginTop: "32px" }} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t.contact.name}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t.contact.phone}</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t.contact.email}</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t.contact.message}</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  disabled={loading}
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>{loading ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t.contact.send}</span>
                </button>
              </form>
            </div>
            <div className="map-container">
              <iframe
                src={contactInfo.mapLink}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "500px" }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
