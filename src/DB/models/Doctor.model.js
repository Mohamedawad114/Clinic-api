import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: 24,
      required: true,
    },
    Bio: {
      type: String,
      required: true,
    },
    imageUrl: {
      path: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);

const doctor = mongoose.model("doctor", doctorSchema);
export default doctor;
