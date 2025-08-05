import AsyncHandler from "express-async-handler";
import {
  validateClinic,
  validateupdateClinic,
} from "../../../middlwares/validation.middleware.js";
import clinic from "../../../DB/models/Clinic.model.js";
import cloudinary from "../../../utiles/cloudinary.js";

export const addInformation = AsyncHandler(async (req, res) => {
  const { address, phone, aboutUs, working_Hours, email } = req.body;
  if (!address || !phone || !aboutUs || !working_Hours || !email)
    return res.status(400).json({ Message: `All inputs required` });
  const { error } = validateClinic(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const create = await clinic.create({
    address,
    phone,
    aboutUs,
    working_Hours,
    email,
  });
  if (create) return res.status(201).json({ message: `Clinic setup done` });
});
export const addphotos = AsyncHandler(async (req, res) => {
  console.log(" ...uploading");
  const Clinic = await clinic.findOne({});
  if (!Clinic) return res.status(404).json({ message: "Clinic not found" });
  const files = req.files;
  if (!files) return res.status(400).json({ message: "No files uploaded" });
  const mediaUrls = files.map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));
  Clinic.images.push(...mediaUrls);
  const updated = await Clinic.save();
  if (updated)
    return res.status(201).json({ message: "Clinic photos uploaded" });
});
export const ClinicupdateInfo = AsyncHandler(async (req, res) => {
  const { address, phone, aboutUs, working_Hours, email } = req.body;
  const { error } = validateupdateClinic(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const find_clinic = await clinic.findOneAndUpdate(
    {},
    { address, phone, aboutUs, working_Hours, email }
  );
  if (find_clinic)
    return res.status(200).json({ message: `Clinic updated seccussfully` });
});
export const deletephoto = AsyncHandler(async (req, res) => {
  const public_id = req.query.public_id;
  const Clinic = await clinic.findOne({});
  if (!Clinic) return res.status(404).json({ message: "Clinic not found" });
  if (!public_id)
    return res.status(400).json({ message: " public_id is required" });
  const result = await cloudinary.uploader.destroy(public_id);
  if (result.result !== "ok")
    return res.status(400).json({ message: "Image not deleted", result });
  Clinic.images = Clinic.images.filter((img) => {
    return img.public_id !== public_id;
  });
  await Clinic.save();
  return res.status(200).json({ message: ` photo deleted` });
});
export const deleteclinic = AsyncHandler(async (req, res) => {
  const Clinic = await clinic.findOne({});
  if (!Clinic) return res.status(404).json({ message: "Clinic not found" });
  for (const img of Clinic.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }
  const deleted = await clinic.deleteOne({});
  if (deleted) {
    return res.status(200).json({ message: `Clinic information deleted` });
  }
});
export const clinicInfo = AsyncHandler(async (req, res) => {
  const Clinic = await clinic.findOne({});
  if (Clinic) return res.status(200).json({ Clinic });
});
