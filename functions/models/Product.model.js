const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  src: { type: String, required: true },
  isMain: { type: Boolean, required: true, default: false },
});

const weightSchema = new Schema({
  value: { type: Number, required: true },
  unit: { type: String, required: true },
});

const dimensionsSchema = new Schema({
  value_x: { type: Number, required: true },
  value_y: { type: Number, required: true },
  unit: { type: String, required: true },
});

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  business: {
    type: Schema.Types.ObjectId,
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
