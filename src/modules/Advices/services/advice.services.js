import AsyncHandler from "express-async-handler";
import advice from "../../../DB/models/Advices.model.js";
import { validateadvice } from "../../../middlwares/validation.middleware.js";
import cloudinary from "../../../utiles/cloudinary.js";
import doctor from "../../../DB/models/Doctor.model.js";

export const insertadvice = AsyncHandler(async (req, res) => {
  const { content, doctorId } = req.body;
  if (!content || !doctorId)
    return res.status(400).json({ Message: `All input required` });
  const { error } = validateadvice(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const valid_doctor = await doctor.findById( doctorId );
  if (!valid_doctor)
    return res.status(404).json({ message: `doctor not found` });
  const created = await advice.create({ content, doctorId });
  if (created) return res.status(201).json({ message: `advice added` });
});
export const advicephoto = AsyncHandler(async (req, res) => {
  const adviceId = req.params.id;
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: `no images upload` });
  const images = req.files.map((img) => {
    return {
      path: img.path,
      public_id: img.public_id,
    };
  });
  const Advice = await advice.findById(adviceId);
  if (!Advice) return res.status(404).json({ message: `advice not found` });
  Advice.images.push(...images);
  const updated = await Advice.save();
  if (!updated)
    return res
      .status(400)
      .json({ message: "Photo not updated or advice not found" });
  return res.status(200).json({ message: "Photo(s) uploaded successfully" });
});
export const editadvice = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const { content, doctorId } = req.body;
  const valid_doctor = await doctor.findById(doctorId);
  if (!valid_doctor)
    return res.status(404).json({ message: `doctor not found` });
  const Advice = await advice.findByIdAndUpdate(id, { content, doctorId });
  if (!Advice) return res.status(404).json({ message: `advice not found` });
  return res.status(200).json({ message: `advice updated` });
});
export const deleteadvice = AsyncHandler(async (req, res) => {
  const adviceId = req.params.id;
  const adviceDoc = await advice.findById(adviceId);
  if (!adviceDoc) return res.status(404).json({ message: "Advice not found" });
  if (adviceDoc.images.length > 0) {
    await Promise.all(
      adviceDoc.images.map((photo) => {
        if (photo.public_id) {
          return cloudinary.uploader.destroy(photo.public_id);
        }
      })
    );
  }
  await advice.deleteOne({ _id: adviceId });
  res.status(200).json({ message: "Advice and associated media deleted" });
});
export const deletephoto = AsyncHandler(async (req, res) => {
  const public_id = req.query.public_id;
  const AdviceId = req.params.adviceId;
  if (!public_id || !AdviceId)
    return res
      .status(400)
      .json({ message: " public_id and adviceId required" });
  const Advice = await advice.findById(AdviceId);
  if (!Advice) return res.status(404).json({ message: "advice not found" });
  const result = await cloudinary.uploader.destroy(public_id);
  if (result.result !== "ok")
    return res.status(400).json({ message: "Image not deleted", result });
  Advice.images = Advice.images.filter((img) => {
    return img.public_id !== public_id;
  });
  await Advice.save();
  return res.status(200).json({ message: ` photo deleted` });
});
export const getadvicesUser = AsyncHandler(async (req, res) => {
  const page_num = parseInt(req.query.page);
  const limit = 3;
  const offset = (page_num - 1) * limit;
  const Advices = await advice
    .find({}, { _id: 0, videoUrl: 0, images: 0 })
    .skip(offset)
    .limit(limit)
    .populate({ path: "doctorId", select: "firstName lastName -_id" });
  if (Advices.length == 0)
    return res.status(200).json({ message: `no advices` });
  return res.status(200).json({ Advices });
});
export const getadvicesAdmin = AsyncHandler(async (req, res) => {
  const page_num = parseInt(req.query.page)||1;
  const limit = 3;
  const offset = (page_num - 1) * limit;
  const Advices = await advice
    .find({}, {})
    .skip(offset)
    .limit(limit)
    .populate({ path: "doctorId", select: "firstName lastName _id" })
    .sort({ createdAt: -1 });
  if (Advices.length == 0)
    return res.status(200).json({ message: `no advices` });
  return res.status(200).json({ Advices });
});
