import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema(
  {
    branding: {
      logo: { type: String, default: "/logo.png" },
      logoSize: { type: Number, default: 50 },
    },
    hero: {
      title: { type: String, default: "خطوط الإنجاز للعقارات" },
      titleEn: { type: String, default: "Khotot Al-Engaz Real Estate" },
      subtitle: { type: String, default: "نحن هنا لنساعدك في العثور على بيت أحلامك" },
      subtitleEn: { type: String, default: "We are here to help you find your dream home" },
      media: { type: String, default: "/hero-bg.jpg" },
      mediaType: { type: String, enum: ["image", "video"], default: "image" },
    },
    announcement: {
      text: { type: String, default: "عرض خاص: وحدات سكنية جديدة في شمال الرياض" },
      textEn: { type: String, default: "Special Offer: New residential units in North Riyadh" },
      color: { type: String, default: "#1a3a5c" },
      speed: { type: Number, default: 30 },
      enabled: { type: Boolean, default: true },
    },
    contact: {
      phone1: { type: String, default: "+966567337666" },
      phone2: { type: String, default: "+966566066952" },
      whatsapp: { type: String, default: "966567337666" },
      email: { type: String, default: "info@khototalengaz.com" },
      address: { type: String, default: "الرياض، المملكة العربية السعودية" },
      addressEn: { type: String, default: "Riyadh, Saudi Arabia" },
      mapLink: { type: String, default: "https://www.google.com/maps/embed?..." },
    },
    about: {
      content: { type: String, default: "شركة رائدة في مجال التطوير العقاري..." },
      contentEn: { type: String, default: "A leading company in real estate development..." },
      images: [{ type: String }],
    },
  },
  { timestamps: true }
);

const Settings = models.Settings || model("Settings", SettingsSchema);

export default Settings;
