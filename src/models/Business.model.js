const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
});

const brnSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const brcSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const businessSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    brn: {
      type: brnSchema,
    },
    brc: {
      type: brcSchema,
    },
    address: { type: addressSchema },
  },
  {
    methods: {
      async verifyBrc() {
        if (this.brc) {
          this.brc.isVerified = true;
          return this;
        }
        throw "Brc not found";
      },

      async verifyBrn() {
        if (this.brn) {
          this.brn.isVerified = true;
          return this;
        }
        throw "Brn not found";
      },
    },
  }
);

module.exports = mongoose.model("Business", businessSchema);
