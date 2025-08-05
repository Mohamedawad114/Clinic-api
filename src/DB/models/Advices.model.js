import mongoose from "mongoose";

const adviceSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        path: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
    ],
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const advice = mongoose.model("advice", adviceSchema);
export default advice;
