
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    assetTag: {
      type: String,
      required: true,
      unique: true,
    },

    brand: {
      type: String,
      default: "Unknown",
    },

    model: {
      type: String,
      default: "Not specified",
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Under Maintenance", "Out of Service"],
      default: "Available",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
