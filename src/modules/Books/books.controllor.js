import express from "express";
import * as books_serv from "./services/books.services.js";
import { validateIsAdmin } from "../../middlwares/auth.middlewaress.js";
import verifyToken from "../../middlwares/auth.middlewaress.js";
import { patientupload } from "../../utiles/cloudinary.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing bookings
 */

/**
 * @swagger
 * /Books/setBook:
 *   post:
 *     summary: Create a new booking
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/setBook", verifyToken, books_serv.setBook);

/**
 * @swagger
 * /Books/{id}/photos:
 *   post:
 *     summary: Upload photos for a booking
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
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
 *         description: Photos uploaded successfully
 */
router.post("/:id/photos", verifyToken, patientupload.array("images", 2), books_serv.bookphotos);

/**
 * @swagger
 * /Books/userbookings:
 *   get:
 *     summary: Get bookings of the logged-in user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User bookings retrieved
 */
router.get("/userbookings", verifyToken, books_serv.userBookings);

/**
 * @swagger
 * /Books/allbookings:
 *   get:
 *     summary: Get all bookings (admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings retrieved
 */
router.get("/allbookings", verifyToken, validateIsAdmin, books_serv.allBookings);

/**
 * @swagger
 * /Books/bookingsDay:
 *   get:
 *     summary: Get today's bookings (admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's bookings
 */
router.get("/bookingsDay", verifyToken, validateIsAdmin, books_serv.dailyBooks);

/**
 * @swagger
 * /Books/bookingsmonth:
 *   get:
 *     summary: Get monthly bookings (admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly bookings
 */
router.get("/bookingsmonth", verifyToken, validateIsAdmin, books_serv.monthlyBooks);

/**
 * @swagger
 * /Books/{id}/cancel:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.delete("/:id/cancel", verifyToken, books_serv.cancleBook);

export default router