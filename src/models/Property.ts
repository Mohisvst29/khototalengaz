import mongoose, { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    titleEn: { type: String },
    description: { type: String, required: true },
    descriptionEn: { type: String },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    locationEn: { type: String },
    type: { type: String, enum: ["apartment", "villa", "floor", "office", "shop"], required: true },
    category: { type: String, enum: ["sale", "rent"], required: true },
    rooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    city: { type: String, required: true },
    cityEn: { type: String },
  },
  { timestamps: true }
);

const Property = models.Property || model("Property", PropertySchema);

export default Property;
