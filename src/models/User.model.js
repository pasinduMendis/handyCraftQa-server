const mongoose = require("mongoose");
const { transformToModel } = require("../services/utils");

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

const phoneSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
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

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: nameSchema, required: true },
    email: { type: emailSchema, required: true },
    phone: { type: phoneSchema },
    address: { type: addressSchema },
    password: { type: String, required: true },
    cart: [cartItemSchema], // Add the cart field as an array of cart items.
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

      verifyPhone() {
        if (this.phone) {
          this.phone.isVerified = true;
          return this;
        }
        throw new Error("Phone is not set");
      },

      addToCart(productId, quantity) {
        // Create a new cart item and add it to the user's cart.
        const newItem = {
          productId,
          quantity: quantity || 1,
        };
        this.cart.push(newItem);
        return this;
      },

      removeFromCart(productId) {
        const index = this.cart.findIndex((item) => item.productId.toString() === productId.toString());
      
        if (index !== -1) {
          this.cart.splice(index, 1);
        } else {
          throw new Error("Product not found in cart");
        }
      
        return this;
      }
      
    },
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
