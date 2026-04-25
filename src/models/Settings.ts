import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema(
  {
    branding: {
      logo: { type: String, default: "/logo.png" },
      logoSize: { type: Number, default: 50 },
    },
    hero: {
      title: { type: String, default: "خطوط الإنجاز للتطوير العقاري" },
      titleEn: { type: String, default: "Khotot Al-Engaz Real Estate Development" },
      subtitle: { type: String, default: "نحن هنا لنساعدك في العثور على بيت أحلامك" },
      subtitleEn: { type: String, default: "We are here to help you find your dream home" },
      slides: [
        {
          url: { type: String, default: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80" },
          type: { type: String, enum: ["image", "video"], default: "image" },
          title: { type: String, default: "" },
          titleEn: { type: String, default: "" },
          subtitle: { type: String, default: "" },
          subtitleEn: { type: String, default: "" },
        }
      ],
      media: { type: String, default: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80" }, // Fallback
      mediaType: { type: String, enum: ["image", "video"], default: "image" }, // Fallback
    },
    announcement: {
      text: { type: String, default: "عرض خاص: وحدات سكنية جديدة في شمال الرياض" },
      textEn: { type: String, default: "Special Offer: New residential units in North Riyadh" },
      color: { type: String, default: "#1a3a5c" },
      speed: { type: Number, default: 30 },
      enabled: { type: Boolean, default: true },
    },
    contact: {
      phone1: { type: String, default: "+966566066952" },
      phone2: { type: String, default: "" },
      whatsapp: { type: String, default: "966566066952" },
      email: { type: String, default: "info@khototalengaz.com" },
      emails: { type: [String], default: ["info@khototalengaz.com"] },
      address: { type: String, default: "الرياض، المملكة العربية السعودية" },
      addressEn: { type: String, default: "Riyadh, Saudi Arabia" },
      mapLink: { type: String, default: "https://www.google.com/maps/embed?..." },
    },
    about: {
      content: { type: String, default: "شركة رائدة في مجال التطوير العقاري..." },
      contentEn: { type: String, default: "A leading company in real estate development..." },
      images: [{ type: String }],
    },
    services: [
      {
        title: { type: String, default: "" },
        titleEn: { type: String, default: "" },
        description: { type: String, default: "" },
        descriptionEn: { type: String, default: "" },
        image: { type: String, default: "" },
      }
    ],
    serviceList: [
      {
        slug: { type: String, required: true },
        title: { type: String, default: "" },
        titleEn: { type: String, default: "" },
        description: { type: String, default: "" },
        descriptionEn: { type: String, default: "" },
        image: { type: String, default: "" },
      }
    ],
    seo: {
      metaTitle: { type: String, default: "شركة خطوط الإنجاز للتطوير العقاري | تطوير، استثمار، إدارة مشاريع" },
      metaTitleEn: { type: String, default: "Khotot Al-Engaz Real Estate Development | Development, Investment, Management" },
      metaDescription: { type: String, default: "شركة متخصصة في التطوير العقاري والإستثمار وإدارة المشاريع، تقدم حلولاً متكاملة تشمل إعادة تأهيل المباني القديمة واستثمارها وتطوير الأراضي، إنشاء المشاريع السكنية والتجارية." },
      metaDescriptionEn: { type: String, default: "Specialized in real estate development, investment, and project management, providing integrated solutions for residential and commercial projects." },
      keywords: { type: String, default: "عقارات، الرياض، شقق للبيع، فيلات" },
      keywordsEn: { type: String, default: "real estate, Riyadh, apartments for sale, villas" },
    },
    social: {
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      snapchat: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Settings = models.Settings || model("Settings", SettingsSchema);

export default Settings;
