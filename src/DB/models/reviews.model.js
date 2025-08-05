import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    stars: {
      type: Number,
      required:true,
      min:1,
      max:5,
  },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const review = mongoose.model("review", reviewSchema);
export default review;
