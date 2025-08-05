import asyncHandler from "express-async-handler";
import {
  validateUser,
  validateUserLogin,
  validateupdatePassword,
  validatePassword,
  validateupdateUser,
} from "../../../middlwares/validation.middleware.js";
import encryption from "../../../utiles/encryption.js";
import decryption from "../../../utiles/decryption.js";
import bcrypt from "bcrypt";
import user from "../../../DB/models/Users.model.js";
import jwt from "jsonwebtoken";
import redis from "../../../utiles/redis.js";
import { v4 as uuidV4 } from "uuid";
import {
  SendEmail,
  createAndSendOTP,
  createAndSendOTP_Password,
  emittir,
} from "../../../utiles/send-email.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, password, email, isAdmin, age, gender } =
    req.body;
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const valid_email = await user.findOne({ email });
  if (valid_email)
    return res.status(409).json({ message: `Email already existed ` });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  const hashpassword = await bcrypt.hash(password, salt);
  const create = await user.create({
    firstName,
    lastName,
    password: hashpassword,
    email,
    isAdmin,
    age,
    gender,
    phone: encryption(phone),
    otps: { confirmation: "" },
  });
  if (create) await createAndSendOTP(create, email);
  return res.status(201).json({ message: `signup done` });
});
export const confrim_email = asyncHandler(async (req, res) => {
  const { OTP, email } = req.body;
  const User = await user.findOne({ email: email, isconfirmed: false });
  if (!User)
    return res.status(400).json({ message: `email is already confirmed ` });
  if (!OTP) return res.status(400).json({ message: `OTP is required` });
  const savedOTP = await redis.get(`otp_${email}`);
  if (!savedOTP) {
    createAndSendOTP(User, email);
    return res
      .status(400)
      .json({ message: `expire OTP, A new OTP has been sent.` });
  }
  const isMAtch = await bcrypt.compare(OTP, User.otps?.confirmation);
  if (!isMAtch) return res.status(400).json({ message: `Invalid OTP` });
  User.isconfirmed = true;
  User.otps.confirmation = undefined;
  await redis.del(`otp_${email}`);
  await User.save();
  return res.status(200).json({ message: `email is confirmed ` });
});
export const loginuser = asyncHandler(async (req, res) => {
  const key = process.env.SECRET_KEY;
  const { password, email } = req.body;
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const valid_email = await user.findOne({ email });
  if (!valid_email) {
    return res.status(404).json({ message: `email not found` });
  }
  const passMatch = await bcrypt.compare(password, valid_email.password);
  if (!passMatch) {
    return res.status(400).json({ message: ` invalid password` });
  }

  const accessToken = jwt.sign(
    {
      id: valid_email._id,
      isAdmin: valid_email.isAdmin,
    },
    key,
    { expiresIn: "1h" }
  );
  const jti = uuidV4();
  const refreshToken = jwt.sign(
    { id: valid_email._id, isAdmin: valid_email.isAdmin, jti },
    key,
    { expiresIn: "1y" }
  );
  await redis.set(jti, valid_email._id.toString(), "ex", 60 * 60 * 24 * 365);
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365 * 1000,
    })
    .json({ message: `login seccussfully`, accessToken });
});
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    const isexisted = await redis.get(decoded.jti);
    if (!isexisted) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { id: decoded.id, isAdmin: decoded.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.json({ accessToken });
  });
});
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (!err && decoded.jti) {
      await redis.del(decoded.jti);
    }
    return res.clearCookie("refreshToken").sendStatus(204);
  });
});
export const updateuser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const User = await user.findById(id);
  const { firstName, lastName, email, phone } = req.body;
  if (await user.findOne({ email: email }))
    return res.status(409).json({ message: `email is already existed` });
  const { error } = validateupdateUser(req.body);
  let encryptedPhone = User.phone;
  if (phone) {
    encryptedPhone = encryption(phone);
  }

  if (error) return res.status(400).json({ message: error.details[0].message });
  const findUser = await user.findByIdAndUpdate(id, {
    firstName,
    lastName,
    email,
    phone: encryptedPhone,
  });
  if (!findUser) return res.status(404).json({ message: `user not found ` });
  return res.status(200).json({ message: `profile updated` });
});
export const deleteaccount = asyncHandler(async (req, res) => {
  let id = req.user.id;
  if (req.user.isAdmin != true) {
    const deleted = await user.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: `User not found` });
    return res.status(200).json({ message: `account deleted` });
  }
});
export const deleteuser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findUser = await user.findByIdAndDelete(id);
  if (!findUser) return res.status(404).json({ message: `User not found` });
  return res.status(200).json({ message: `user deleted` });
});
export const updatePass = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const User = await user.findById(id);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: `All input required` });
  const { error } = validateupdatePassword(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const IsMatch = await bcrypt.compare(oldPassword, User.password);
  if (!IsMatch) return res.status(400).json({ message: `Invalid oldPassword` });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  User.password = await bcrypt.hash(newPassword, salt);
  await User.save();
  return res.status(200).json({ message: `password updated` });
});

export const resetPasswordreq = asyncHandler(async (req, res) => {
  const User = await user.findById(req.user.id);
  if (!User) return res.status(404).json({ message: "User not found" });
  createAndSendOTP_Password(User, User.email);
  return res.status(200).json({ message: `OTP is sent` });
});
export const resetPasswordconfrim = asyncHandler(async (req, res) => {
  const User = await user.findById(req.user.id);
  const { OTP, newPassword } = req.body;
  if (!OTP || !newPassword)
    return res
      .status(400)
      .json({ message: "Both OTP and new passwords are required" });
  const savedOTP = await redis.get(`otp_${User.email}`);
  if (!savedOTP) {
    createAndSendOTP_Password(User, User.email);
    return res
      .status(400)
      .json({ message: `expire OTP, A new OTP has been sent.` });
  }
  const isMatch = await bcrypt.compare(OTP, User.otps?.reset);
  if (!isMatch) return res.status(400).json({ message: `Invalid OTP` });
  const { error } = validatePassword(newPassword);
  if (error)
    return res
      .status(400)
      .json({ message: `password length must greater than 6 or equal ` });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  const hashpassword = await bcrypt.hash(newPassword, salt);
  User.password = hashpassword;
  User.otps.reset = undefined;
  await redis.del(`otp_${User.email}`);
  await User.save();
  return res.status(200).json({ message: `password updated` });
});
export const getprofile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const User = await user.findById(id, {
    password: 0,
    isAdmin: 0,
    __v: 0,
    updatedAt: 0,
    _id: 0,
    otps: 0,
  });
  if (!User) return res.status(404).json({ message: ` user not found` });
  User.phone = decryption(User.phone);
  return res.status(200).json({ User });
});
export const getuser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ message: `userId is required` });
  const User = await user.findById(userId, { password: 0, otps: 0 });
  if (!User) return res.status(404).json({ message: ` user not found` });
  User.phone = decryption(User.phone);
  return res.status(200).json({ User });
});
export const getusers = asyncHandler(async (req, res) => {
  const page_num = parseInt(req.query.page_num);
  const limit = 3;
  const offest = (page_num - 1) * limit;
  const Users = await user
    .find({ isAdmin: false }, { password: 0, otps: 0, isAdmin: 0 })
    .skip(offest)
    .limit(limit);
  if (Users.length == 0) return res.status(200).json({ message: ` no  users` });
  const UsersData = Users.map((user) => {
    return {
      ...user._doc,
      phone: decryption(user.phone),
    };
  });
  return res.status(200).json({ UsersData });
});
