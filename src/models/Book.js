import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    total: { type: Number, required: true, default: 1 },
    available: { type: Number, required: true, default: 1 },
    image: { type: String, default: "/book-1.png" },
    // Cloudinary public id for the private PDF (use signed URLs for access)
    filePublicId: { type: String, required: true },
    // Optional legacy/public URL (kept for older data compatibility)
    fileUrl: { type: String, default: "" },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
  },
  { timestamps: true }
);

// In Next.js dev/HMR the model can get cached with an older schema.
// Drop the cached model so schema changes apply immediately.
if (process.env.NODE_ENV !== "production" && mongoose.models.Book) {
  delete mongoose.models.Book;
}

export default mongoose.model("Book", bookSchema);
