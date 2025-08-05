import express from "express";
import * as user_serv from "./services/users.services.js";
import verifyToken, {
  validateIsAdmin,
} from "../../middlwares/auth.middlewaress.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ahmed
 *               lastName:
 *                 type: string
 *                 example: Mohamed
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "01012345678"
 *     responses:
 *       201:
 *         description: User registered
 */
router.post("/signup", user_serv.signup);

/**
 * @swagger
 * /users/confirmemail:
 *   post:
 *     summary: Confirm user email using OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               OTP:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email confirmed
 */
router.post("/confirmemail", user_serv.confrim_email);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user and return access token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in
 */
router.post("/login", user_serv.loginuser);

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated
 */
router.put("/update", verifyToken, user_serv.updateuser);

/**
 * @swagger
 * /users/updatePassword:
 *   put:
 *     summary: Update user password using old password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.put("/updatePassword", verifyToken, user_serv.updatePass);

/**
 * @swagger
 * /users/editpassword:
 *   put:
 *     summary: Reset password using OTP
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               OTP:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset
 */
router.put("/editpassword", verifyToken, user_serv.resetPasswordconfrim);

/**
 * @swagger
 * /users/refresh:
 *   get:
 *     summary: Get a new access token using refresh token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: New access token
 */
router.get("/refresh", user_serv.refreshToken);

/**
 * @swagger
 * /users/reqresestpassword:
 *   get:
 *     summary: Request to reset password (sends OTP)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.get("/reqresestpassword", verifyToken, user_serv.resetPasswordreq);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get("/profile", verifyToken, user_serv.getprofile);

/**
 * @swagger
 * /users/logout:
 *   delete:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: Logged out
 */
router.delete("/logout", user_serv.logout);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete own account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 */
router.delete("/delete", verifyToken, user_serv.deleteaccount);

/**
 * @swagger
 * /users/usersdata:
 *   get:
 *     summary: Get list of all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/usersdata", verifyToken, validateIsAdmin, user_serv.getusers);

/**
 * @swagger
 * /users/searchuser/{id}:
 *   get:
 *     summary: Get user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/searchuser/:id", verifyToken, validateIsAdmin, user_serv.getuser);

/**
 * @swagger
 * /users/deleteuser/{id}:
 *   delete:
 *     summary: Delete user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/deleteuser/:id", verifyToken, validateIsAdmin, user_serv.deleteuser);

export default router;
