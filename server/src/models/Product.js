import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category: { type: String, default: "General", trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10, min: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", default: null },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
