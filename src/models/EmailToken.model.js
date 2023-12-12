const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailTokenSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const EmailToken = mongoose.model("EmailToken", emailTokenSchema);

module.exports = EmailToken;
