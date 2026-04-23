import mongoose from "mongoose";

const LeadRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
    },
    city: {
      type: String,
      required: [true, "Please select a city"],
    },
    propertyType: {
      type: String,
      required: [true, "Please select a property type"],
    },
    listingType: {
      type: String,
      required: [true, "Please select a listing type"],
    },
    budget: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.LeadRequest || mongoose.model("LeadRequest", LeadRequestSchema);
