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
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSettings(data);
      });
  }, []);

  // ✅ الحل النهائي (بدون default غلط)
  const contactInfo = settings?.contact;

  // ✅ Loading احترافي بدل ما يظهر رقم غلط
  if (!contactInfo) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h2>جاري تحميل بيانات التواصل...</h2>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        toast.success(
          locale === "ar"
            ? "تم إرسال رسالتك بنجاح!"
            : "Message sent successfully!"
        );
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.error(
          locale === "ar"
            ? "حدث خطأ أثناء الإرسال."
            : "Error sending message."
        );
      }
    } catch (error) {
      toast.error(
        locale === "ar" ? "خطأ في الاتصال." : "Connection error."
      );
    } finally {
      setLoading(false);
    }
  };

  const getMapSrc = (link: string) => {
    if (!link) return "";

    if (link.includes("<iframe") || link.includes("<IFRAME")) {
      const match = link.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) return match[1];
    }

    let cleanLink = link.trim().replace(/^["']|["']$/g, "");

    if (cleanLink.includes("maps.app.goo.gl")) {
      return cleanLink;
    }

    if (
      cleanLink.includes("google.com/maps") &&
      !cleanLink.includes("output=embed") &&
      !cleanLink.includes("/embed")
    ) {
      const qMatch = cleanLink.match(/place\/([^\/]+)/);
      if (qMatch)
        return `https://maps.google.com/maps?q=${qMatch[1]}&output=embed`;

      const coordMatch = cleanLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch)
        return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;

      return cleanLink.split("?")[0] + "?output=embed";
    }

    return cleanLink;
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

              {/* 📞 Phone */}
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>{locale === "ar" ? "اتصل بنا" : "Call Us"}</h4>
                  <a href={`tel:${contactInfo.phone1}`}>
                    {contactInfo.phone1}
                  </a>

                  {contactInfo.phone2 && (
                    <>
                      <br />
                      <a href={`tel:${contactInfo.phone2}`}>
                        {contactInfo.phone2}
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* 📧 Email */}
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>{t.contact.email}</h4>
                  <a href={`mailto:${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>

                  {contactInfo.emails &&
                    contactInfo.emails.map(
                      (email: string, idx: number) =>
                        email && (
                          <React.Fragment key={idx}>
                            <br />
                            <a href={`mailto:${email}`}>{email}</a>
                          </React.Fragment>
                        )
                    )}
                </div>
              </div>

              {/* 📍 Location */}
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>{locale === "ar" ? "الموقع" : "Location"}</h4>
                  <span>
                    {locale === "ar"
                      ? contactInfo.address
                      : contactInfo.addressEn || contactInfo.address}
                  </span>
                </div>
              </div>

              {/* 💬 WhatsApp */}
              <div className="contact-item">
                <i className="fab fa-whatsapp"></i>
                <div>
                  <h4>WhatsApp</h4>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +{contactInfo.whatsapp}
                  </a>
                </div>
              </div>

              {/* 📩 Form */}
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
                  <span>
                    {loading
                      ? locale === "ar"
                        ? "جاري الإرسال..."
                        : "Sending..."
                      : t.contact.send}
                  </span>
                </button>
              </form>
            </div>

            {/* 🗺️ Map */}
            <div className="map-container">
              <iframe
                src={getMapSrc(contactInfo.mapLink)}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "500px" }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
