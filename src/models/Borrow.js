import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedAt: { type: Date, default: null },
    status: { type: String, enum: ["active", "returned"], default: "active" },
  },
  { timestamps: true }
);

borrowSchema.index({ user: 1, book: 1, status: 1 });

export default mongoose.models.Borrow || mongoose.model("Borrow", borrowSchema);
