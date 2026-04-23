"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const t = getTranslation(locale);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "riyadh",
    propertyType: "apartment",
    listingType: "sale",
    budget: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(t.lead.success);
        setFormData({
          name: "",
          phone: "",
          city: "riyadh",
          propertyType: "apartment",
          listingType: "sale",
          budget: "",
        });
        onClose();
      } else {
        toast.error(t.lead.error);
      }
    } catch (error) {
      toast.error(locale === 'ar' ? "حدث خطأ في الاتصال بالخادم." : "Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ animation: 'fadeIn 0.3s ease' }}>
        <div className="modal-header">
          <h3>{t.lead.title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="hero-form" style={{ padding: 0, boxShadow: 'none' }}>
            <div className="form-grid">
              <div className="form-group">
                <label>{t.lead.name}</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder={locale === 'ar' ? "مثال: محمد أحمد" : "e.g. John Doe"}
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>{t.lead.phone}</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="05XXXXXXXX"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>{t.lead.city}</label>
                <select name="city" className="form-control" value={formData.city} onChange={handleChange}>
                  <option value="riyadh">{t.lead.riyadh}</option>
                  <option value="jeddah">{t.lead.jeddah}</option>
                  <option value="dammam">{t.lead.dammam}</option>
                  <option value="khobar">{t.lead.khobar}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t.lead.property_type}</label>
                <select name="propertyType" className="form-control" value={formData.propertyType} onChange={handleChange}>
                  <option value="apartment">{t.property.apartment}</option>
                  <option value="villa">{t.property.villa}</option>
                  <option value="floor">{t.property.floor}</option>
                  <option value="office">{t.property.office}</option>
                  <option value="land">{locale === 'ar' ? 'أرض' : 'Land'}</option>
                </select>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>{t.lead.listing_type}</label>
                <select name="listingType" className="form-control" value={formData.listingType} onChange={handleChange}>
                  <option value="sale">{locale === 'ar' ? 'شراء' : 'Buy'}</option>
                  <option value="rent">{t.property.rent}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t.lead.budget}</label>
                <input
                  type="text"
                  name="budget"
                  className="form-control"
                  placeholder={locale === 'ar' ? "مثال: 1,000,000" : "e.g. 1,000,000"}
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary full" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
              {loading ? t.lead.loading : t.lead.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
