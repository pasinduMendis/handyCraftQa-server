const mongoose = require("mongoose");
const { transformToModel } = require("../services/utils");

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

const identitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["NIC", "PASSPORT", "DRIVING_LICENSE"],
    required: true,
  },
  id: { type: String, required: true },
  file: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

const phoneSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

const statusSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: true },
  isBasicRegistrationCompleted: { type: Boolean, default: false },
  isAdvancedRegistrationCompleted: { type: Boolean, default: false },
  isBusinessRegistrationCompleted: { type: Boolean, default: false },
});

const addressSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  street: { type: String, required: true },
});

const nameSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const VendorSchema = new mongoose.Schema(
  {
    name: { type: nameSchema, required: true },
    email: { type: emailSchema, required: true },
    password: { type: String, required: true },
    identity: { type: identitySchema },
    phone: { type: phoneSchema },
    address: { type: addressSchema },
    status: {
      type: statusSchema,
      required: true,
      default: {
        isActive: true,
        isBasicRegistrationCompleted: false,
        isAdvancedRegistrationCompleted: false,
        isBusinessRegistrationCompleted: false,
      },
    },
  },
  {
    methods: {
      toModel() {
        return transformToModel(this);
      },

      verifyEmail() {
        this.email.isVerified = true;
        return this;
      },

      verifyIdentity() {
        if (this.identity) {
          this.identity.isVerified = true;
          return this;
        }
        throw new Error("Identity is not set");
      },

      verifyPhone() {
        if (this.phone) {
          this.phone.isVerified = true;
          return this;
        }
        throw new Error("Phone is not set");
      },

      completeBasicRegistration() {
        this.status.isBasicRegistrationCompleted = true;
        return this;
      },

      completeBusinessRegistration() {
        this.status.isBusinessRegistrationCompleted = true;
        return this;
      },

      completeAdvancedRegistration() {
        this.status.isAdvancedRegistrationCompleted = true;
        return this;
      },

      activateAccount() {
        this.status.isActive = true;
        return this;
      },

      deactivateAccount() {
        this.status.isActive = false;
        return this;
      },
    },
  }
);

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
