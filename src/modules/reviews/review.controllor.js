import express from "express";
import * as review_serv from "./services/review.services.js";
import { validateIsAdmin } from "../../middlwares/auth.middlewaress.js";
import verifyToken from "../../middlwares/auth.middlewaress.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management APIs
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "الخدمة ممتازة"
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request
 */
router.post("/", verifyToken, review_serv.addreview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 */
router.get("/", review_serv.allreviews);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID (user access)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
router.delete("/:id", verifyToken, review_serv.delete_review);

/**
 * @swagger
 * /reviews/admin/{id}:
 *   delete:
 *     summary: Delete any review by ID (admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted by admin
 *       403:
 *         description: Unauthorized or forbidden
 *       404:
 *         description: Review not found
 */
router.delete("/admin/:id", verifyToken, validateIsAdmin, review_serv.delete_review_admin);

export default router;
