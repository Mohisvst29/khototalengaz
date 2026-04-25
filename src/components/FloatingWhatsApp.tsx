"use client";

import React, { useEffect, useState } from "react";

const FloatingWhatsApp = () => {
  const [whatsapp, setWhatsapp] = useState("966566066952");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data?.contact?.whatsapp) {
          const sanitized = data.contact.whatsapp.replace(/\D/g, "");
          setWhatsapp(sanitized);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=مرحبا، أرغب في الاستفسار عن الوحدات المتاحة`}
      className="floating-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
};

export default FloatingWhatsApp;
