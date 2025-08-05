import * as clinic_serv from "./services/clinic.services.js";
import express from "express";
import { validateIsAdmin } from "../../middlwares/auth.middlewaress.js";
import verifyToken from "../../middlwares/auth.middlewaress.js";
import { clinicupload } from "../../utiles/cloudinary.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clinic
 *   description: API for managing clinic info and photos
 */

/**
 * @swagger
 * /clinic/clinicInfo:
 *   post:
 *     summary: Add clinic information
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               aboutUs:
 *                 type: string
 *               working_Hours:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Clinic setup done
 */
router.post("/clinicInfo", verifyToken, validateIsAdmin, clinic_serv.addInformation);

/**
 * @swagger
 * /clinic/clinicphotos:
 *   post:
 *     summary: Upload clinic photos
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Clinic photos uploaded
 */
router.post("/clinicphotos", verifyToken, validateIsAdmin, clinicupload.array("images", 6), clinic_serv.addphotos);

/**
 * @swagger
 * /clinic/editclinicInfo:
 *   put:
 *     summary: Update clinic information
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               aboutUs:
 *                 type: string
 *               working_Hours:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 */
router.put("/editclinicInfo", verifyToken, validateIsAdmin, clinic_serv.ClinicupdateInfo);

/**
 * @swagger
 * /clinic/clinicInfo:
 *   get:
 *     summary: Get clinic information
 *     tags: [Clinic]
 *     responses:
 *       200:
 *         description: Clinic info retrieved
 */
router.get("/clinicInfo", clinic_serv.clinicInfo);

/**
 * @swagger
 * /clinic/deletephoto:
 *   delete:
 *     summary: Delete a clinic photo by public_id
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID of the image to delete
 *     responses:
 *       200:
 *         description: Photo deleted
 */
router.delete("/deletephoto", verifyToken, validateIsAdmin, clinic_serv.deletephoto);

/**
 * @swagger
 * /clinic/deleteinformation:
 *   delete:
 *     summary: Delete all clinic information
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clinic information deleted
 */
router.delete("/deleteinformation", verifyToken, validateIsAdmin, clinic_serv.deleteclinic);

export default router;
