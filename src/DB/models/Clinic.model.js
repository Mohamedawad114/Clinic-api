
import mongoose from "mongoose";

const CLinicSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone:{
        type:String,
        required:true
    },
    aboutUs:{
        type:String,
        required:true
    },
    images: [ 
      {
        url: { type: String, required: true },       
        public_id: { type: String, required: true },
      }
    ],
    working_Hours: {
      type: String,
      required: true,
    },
        email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
  },
  {
    timestamps: true,
  }
);

const clinic = mongoose.model("clinic", CLinicSchema);
export default clinic;
