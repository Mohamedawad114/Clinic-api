import { v2 as cloudinary } from "cloudinary";
import env from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

env.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const doctorstorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "doctor photo",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg"],
    quality: "auto",
    fetch_format: "auto",
  },
});

export const upload = multer({ storage: doctorstorage });

const advicesphotosstorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "advices folder",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg"],
    quality: "auto",
    fetch_format: "auto",
  },
});

export const photosupload = multer({ storage: advicesphotosstorage });

const clinicostorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "clinic_folder",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg"],
    quality: "auto",
    fetch_format: "auto",
  },
});

export const clinicupload = multer({ storage: clinicostorage });

///
const bookingphotostorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "patient folder",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg"],
    quality: "auto",
    fetch_format: "auto",
  },
});

export const patientupload = multer({
  storage: bookingphotostorage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

export default cloudinary;
