import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
