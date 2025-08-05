import AsyncHandler from "express-async-handler";
import doctor from "../../../DB/models/Doctor.model.js";
import {
  validatedoctor,
  validatedupdatedoctor,
} from "../../../middlwares/validation.middleware.js";
import encryption from "../../../utiles/encryption.js";
import decryption from "../../../utiles/decryption.js";
import cloudinary from "../../../utiles/cloudinary.js";

export const insertDoc = AsyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email, age, Bio, gender } = req.body;
  if (!firstName || !lastName || !phone || !email || !age || !Bio || !gender)
    return res.status(400).json({ message: `All inputs required` });
  const { error } = validatedoctor(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const valid_email = await doctor.findOne({ email });
  if (valid_email)
    return res.status(409).json({ message: `Email already existed ` });
  const create = await doctor.create({
    firstName,
    lastName,
    phone: encryption(phone),
    email: encryption(email),
    age,
    Bio,
    gender,
  });
  if (create)
    return res.status(201).json({ message: `Doctor added seccussfully` });
});
export const docphoto = AsyncHandler(async (req, res) => {
  const doctorId = req.params.id;
  const { path, filename: public_id } = req.file;
  if (!path || !public_id)
    return res.status(400).json({ message: `no image upload` });
  const addphoto = await doctor.findByIdAndUpdate(doctorId, {
    imageUrl: { path: path, public_id: public_id },
  });

  if (!addphoto)
    return res
      .status(400)
      .json({ message: `photo not updated Or doctor not found` });
  res.status(200).json({ message: "Photo uploaded" });
});
export const updateDoc = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const Doc = await doctor.findById(id);
  if (!Doc) return res.status(404).json({ message: `Doctor not found` });
  const { firstName, lastName, phone, email, Bio } = req.body;
  const { error } = validatedupdatedoctor(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const valid_email = await doctor.findOne({ email });
  if (valid_email)
    return res.status(409).json({ message: `Email already existed` });
  const updateData = {
    firstName,
    lastName,
    Bio,
  };

  if (phone) updateData.phone = encryption(phone);
  if (email) updateData.email = encryption(email);

  await doctor.updateOne({ _id: id }, updateData);
  return res.status(200).json({ message: `Doctor updated` });
});
export const deletephoto = AsyncHandler(async (req, res) => {
  const doctorId = req.params.id;
  const Doc = await doctor.findById(doctorId);
  if (!Doc) return res.status(404).json({ message: `Doctor not found` });
  const image = Doc.imageUrl?.public_id;
  if (!image)
    return res.status(400).json({ message: `No image found to delete` });
  const result = await cloudinary.uploader.destroy(image);
  if (result.result !== "ok")
    return res.status(400).json({ message: "Image not deleted", result });
  Doc.imageUrl.path = "";
  Doc.imageUrl.public_id = "";
  await Doc.save();
  return res.status(200).json({ message: ` photo deleted` });
});
export const deleteDoc = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const Doc = await doctor.findById(id);
  if (!Doc) return res.status(404).json({ message: `Doctor not found` });
  if (Doc.imageUrl?.public_id) {
    await cloudinary.uploader.destroy(Doc.imageUrl.public_id);
  }
  await doctor.deleteOne({ _id: id });
  return res.status(200).json({ message: `Doctor deleted` });
});
export const doctorsfrofile = AsyncHandler(async (req, res) => {
  const Doctors = await doctor
    .find({}, { email: 0, phone: 0, imageUrl: 0, updatedAt: 0, _id: 0 })
    .sort({ createdAt: -1 });
  if (Doctors.length > 0) return res.status(200).json({ Doctors });
});
export const doctorsData = AsyncHandler(async (req, res) => {
  const Doctors = await doctor
    .find({}, { imageUrl: 0 })
    .sort({ createdAt: -1 })
    .lean();
  if (Doctors.length == 0)
    return res.status(200).json({ message: `no doctors found` });
  const DoctorsData = Doctors.map((Doc) => {
    return {
      ...Doc,
      phone: decryption(Doc.phone),
      email: decryption(Doc.email),
    };
  });
  return res.status(200).json({ DoctorsData });
});
