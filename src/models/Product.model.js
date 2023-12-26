const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  isMain: { type: Boolean, required: true, default: false },
});

const weightSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, required: true },
});

const dimensionsSchema = new mongoose.Schema({
  value_x: { type: Number, required: true },
  value_y: { type: Number, required: true },
  unit: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  images: { type: [imageSchema], required: true },
  manufacturer: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  weight: { type: weightSchema, required: true },
  dimensions: { type: dimensionsSchema, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
