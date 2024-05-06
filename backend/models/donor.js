const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    uid: String,
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
          throw new Error("Email is not valid.");
        }
      },
    },
    amount: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    currentAddress: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    organizationName: {
      type: String,
      trim: true,
    },
    organizationAddress: {
      type: String,
      trim: true,
    },
    organizationWebsite: {
      type: String,
      trim: true,
    },
    partnershipType: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;
