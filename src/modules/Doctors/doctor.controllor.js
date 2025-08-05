import express from "express";
import * as doctor_serv from "./services/docotor.services.js";
import { validateIsAdmin } from "../../middlwares/auth.middlewaress.js";
import verifyToken from "../../middlwares/auth.middlewaress.js";
import { upload } from "../../utiles/cloudinary.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: API for managing doctors
 */

/**
 * @swagger
 * /doctors/adddoctor:
 *   post:
 *     summary: Add a new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: number
 *               Bio:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor added successfully
 */
router.post("/adddoctor", verifyToken, validateIsAdmin, doctor_serv.insertDoc);

/**
 * @swagger
 * /doctors/{id}/doctorphoto:
 *   post:
 *     summary: Upload doctor's profile photo
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded
 */
router.post("/:id/doctorphoto", verifyToken, validateIsAdmin, upload.single("image"), doctor_serv.docphoto);

/**
 * @swagger
 * /doctors/{id}/editdoctor:
 *   put:
 *     summary: Update doctor profile
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               Bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated
 */
router.put("/:id/editdoctor", verifyToken, validateIsAdmin, doctor_serv.updateDoc);

/**
 * @swagger
 * /doctors/doctorsdata:
 *   get:
 *     summary: Get all doctors data (admin only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors with decrypted data
 */
router.get("/doctorsdata", verifyToken, validateIsAdmin, doctor_serv.doctorsData);

/**
 * @swagger
 * /doctors/doctorsInformation:
 *   get:
 *     summary: Get doctors public information
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Doctors information without private fields
 */
router.get("/doctorsInformation", doctor_serv.doctorsfrofile);

/**
 * @swagger
 * /doctors/{id}/photo:
 *   delete:
 *     summary: Delete a doctor's photo
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Photo deleted
 */
router.delete("/:id/photo", verifyToken, validateIsAdmin, doctor_serv.deletephoto);

/**
 * @swagger
 * /doctors/delete/{id}:
 *   delete:
 *     summary: Delete a doctor by ID
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor deleted
 */
router.delete("/delete/:id", verifyToken, validateIsAdmin, doctor_serv.deleteDoc);

export default router;
