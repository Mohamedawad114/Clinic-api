import express from "express";
import * as advice_serv from "./services/advice.services.js";
import { validateIsAdmin } from "../../middlwares/auth.middlewaress.js";
import verifyToken from "../../middlwares/auth.middlewaress.js";
import { photosupload } from "../../utiles/cloudinary.js";

const router = express.Router();

/**
 * @swagger
 * /advices/addadvice:
 *   post:
 *     summary: Add a new advice
 *     tags: [Advices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Advice added successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/addadvice",
  verifyToken,
  validateIsAdmin,
  advice_serv.insertadvice
);

/**
 * @swagger
 * /advices/addphoto/{id}:
 *   post:
 *     summary: Upload photos for an advice
 *     tags: [Advices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       200:
 *         description: Photo(s) uploaded successfully
 *       404:
 *         description: Advice not found
 */
router.post(
  "/addphoto/:id",
  verifyToken,
  validateIsAdmin,
  photosupload.array("images", 3),
  advice_serv.advicephoto
);

/**
 * @swagger
 * /advices/editadvice/{id}:
 *   put:
 *     summary: Edit an existing advice
 *     tags: [Advices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Advice updated successfully
 *       404:
 *         description: Advice not found
 */
router.put(
  "/editadvice/:id",
  verifyToken,
  validateIsAdmin,
  advice_serv.editadvice
);

/**
 * @swagger
 * /advices/allData:
 *   get:
 *     summary: Get all advices (admin view)
 *     tags: [Advices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all advices
 */
router.get(
  "/allData",
  verifyToken,
  validateIsAdmin,
  advice_serv.getadvicesAdmin
);

/**
 * @swagger
 * /advices/alladvices:
 *   get:
 *     summary: Get all public advices
 *     tags: [Advices]
 *     responses:
 *       200:
 *         description: List of advices
 */
router.get("/alladvices", advice_serv.getadvicesUser);

/**
 * @swagger
 * /advices/delete/{id}:
 *   delete:
 *     summary: Delete an advice
 *     tags: [Advices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Advice and associated media deleted
 *       404:
 *         description: Advice not found
 */
router.delete(
  "/delete/:id",
  verifyToken,
  validateIsAdmin,
  advice_serv.deleteadvice
);

/**
 * @swagger
 * /advices/{adviceId}/deletephoto:
 *   delete:
 *     summary: Delete a photo from an advice
 *     tags: [Advices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adviceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Photo deleted
 *       404:
 *         description: Advice not found
 */
router.delete(
  "/:adviceId/deletephoto",
  verifyToken,
  validateIsAdmin,
  advice_serv.deletephoto
);

export default router;
