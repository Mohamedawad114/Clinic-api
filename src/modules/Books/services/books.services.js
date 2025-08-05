import AsyncHandler from "express-async-handler";
import { validateBook } from "../../../middlwares/validation.middleware.js";
import Books from "../../../DB/models/Booking.model.js";
import cloudinary from "../../../utiles/cloudinary.js";
import user from "../../../DB/models/Users.model.js";
import { emailBooks, revealDay } from "../../../utiles/send-email.js";
import encryption from "../../../utiles/encryption.js";
import decryption from "../../../utiles/decryption.js";
import dayjs from "dayjs";
import cron from "node-cron";

export const setBook = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const User = await user.findById(userId);
  if (!User) return res.status(404).json({ message: `user not found` });
  const { fullName, age, phone, date, Comment } = req.body;
  if (!fullName || !age || !phone || !date || !Comment)
    return res.status(400).json({ Message: `All inputs required` });
  const { error } = validateBook(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const created = await Books.create({
    userId:userId,
    fullName,
    age,
    phone: encryption(phone),
    date,
    Comment,
  });
  if (created) {
    await emailBooks(User.email);
    return res.status(201).json({ message: `تم تسجيل الحجز بنجاح` });
  }
});
export const bookphotos = AsyncHandler(async (req, res) => {
  const bookId = req.params.id;
  if (!bookId) return res.status(400).json({ Message: `bookId required` });
  const Book = await Books.findOne({ _id: bookId });
  if (!Book) return res.status(400).json({ Message: `booking not found` });
  if (Book.userId.toString() !== req.user.id)
    return res
      .status(403)
      .json({ message: "Unauthorized access to this booking" });
  const file = req.files;
  if (!file) return res.status(400).json({ Message: `file required` });
  const images = file.map((img) => {
    return {
      url: img.path,
      publicId: img.filename,
    };
  });
  Book.images = images;
  await Book.save();
  return res.status(201).json({ message: `photo uploaded` });
});
export const dailyBooks = AsyncHandler(async (req, res) => {
  const today = dayjs().startOf("day").toDate();
  const endday = dayjs().endOf("day").toDate();
  const dayBookings = await Books.find({ date: { $gte: today, $lte: endday } });
  if (!dayBookings)
    return res.status(200).json({ message: `NO bookings for day` });
  return res.status(200).json({ Bookings: dayBookings });
});
export const monthlyBooks = AsyncHandler(async (req, res) => {
  const month = dayjs().startOf("month");
  const lastmonth = month.subtract(1, "month");
  const monthBookings = await Books.find({
    date: { $gte: lastmonth.toDate(), $lt: month.toDate() },
  });
  if (!monthBookings)
    return res.status(200).json({ message: `NO bookings for day` });
  return res.status(200).json({ Bookings: monthBookings });
});

export const userBookings = AsyncHandler(async (req, res) => {
  const userId = req.user.id;
  const User = await user.findById(userId);
  if (!User) return res.status(404).json({ message: `user not found` });
  const Bookings = await Books.find({ userId: userId }, { userId: 0,phone:0 });
  if (Bookings.length === 0)
    return res.status(200).json({ message: `No Bookings yet` });
  return res.status(200).json({ Bookings });
});
export const allBookings = AsyncHandler(async (req, res) => {
  const pageNum = parseInt(req.query.page);
  const name = req.query.name;
  const limit = 8;
  const offset = (pageNum - 1) * limit;
  const Bookings = await Books.find({ ...(name && { fullName: name }) })
    .populate({ path: "userId", select: " firstName lastName" })
    .skip(offset)
    .limit(limit);
  if (Bookings.length === 0)
    return res.status(200).json({ message: `No Bookings yet` });
  const BookingsData = Bookings.map((data) => {
    return {
      ...data._doc,
      phone: decryption(data.phone),
    };
  });
  return res.status(200).json({ Bookings: BookingsData });
});
export const cancleBook = AsyncHandler(async (req, res) => {
  const BookId = req.params.id;
  const book = await Books.findById(BookId);
  if (!book) return res.status(404).json({ message: `No Booking found` });
  if (req.user.id != book.userId) {
    return res.status(403).json({ message: "you 're not authorizate" });
  }
   if (book.isCancled)
    return res.status(400).json({ message: `This booking is already cancelled.` });

  const bookDate = dayjs(book.date).startOf("day");
  if (bookDate.isSame(dayjs().startOf("day")))
    return res
      .status(400)
      .json({ message: `you can't cancle Book in the revealing day` });
      if (book.images.length > 0) {
    await Promise.all(
      book.images.map((img) => cloudinary.uploader.destroy(img.publicId))
    );
  }
  book.isCancled = true;
  await book.save();
  return res.status(200).json({ message: `canceld` });
});
