import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 4,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => !isNaN(new Date(value)),
        message: "Invalid date format. Use YYYY-MM-DD",
      },
    },
    Comment: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      message: `Invalid userId`,
    },
    isCancled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ createdAt: -1 });
const Books = mongoose.model("Book", BookingSchema);
export default Books;
