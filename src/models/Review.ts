const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who wrote the review
    driver: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Driver being reviewed
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
    comment: { type: String }, // Optional comment
    date: { type: Date, default: Date.now }, // Date of the review
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
