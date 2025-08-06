# 🦷 Dental Clinic API

A complete RESTful API for managing a dental clinic system, including users, doctors, appointments, clinic data, advice articles, and reviews. Built with Node.js, Express, MongoDB, JWT, and Cloudinary — secured and production-ready.

---

## 🚀 Features

- User registration, login, profile, and secure password updates
- OTP-based email verification and password reset (with expiration)
- JWT Authentication & Refresh Token system
- Admin authorization & protected routes
- CRUD for Doctors, Appointments, Clinic Info, Advices, and Reviews
- Daily & Monthly appointment statistics
- Upload & delete images and videos with **Cloudinary**
- Email notifications for appointments and reminders (via `node-cron`)
- API rate-limiting and login attempt tracking using **Redis**
- Input validation using **Joi**
- Security middleware: **Helmet**, **HPP**
- **Swagger UI** documentation at `/api-docs`

---

## 🧰 Tech Stack

| Tool          | Purpose                                  |
|---------------|------------------------------------------|
| **Node.js**   | Runtime Environment                      |
| **Express.js**| Web framework                            |
| **MongoDB**   | NoSQL Database                           |
| **Mongoose**  | MongoDB ODM                              |
| **JWT**       | Authentication                           |
| **Redis**     | Caching & Rate limiting, OTP handling    |
| **Cloudinary**| Image & Video Uploads                    |
| **Day.js**    | Date handling                            |
| **Joi**       | Data validation                          |
| **Bcrypt**    | Password hashing                         |
| **Nodemailer**| Email sending                            |
| **Swagger**   | API documentation                        |
| **Helmet**    | Secures HTTP headers                     |
| **HPP**       | Protects against HTTP Parameter Pollution|

---
🔑 Authentication
Access Token: Used for authorization (expires in minutes)

Refresh Token: To generate new access tokens (stored in cookies)

OTP with expiration: Used for email verification & password reset

Role-based Access: Admin users have additional privileges


🔄 Scheduled Jobs
Using node-cron to send appointment reminder emails daily at 9 AM.


📬 Email Templates
✔️ OTP verification

🔁 Reset password

📅 Appointment confirmation

📢 Reminder on the appointment day

🔒 Security & Best Practices
Passwords & OTPs hashed using bcrypt

All inputs validated with Joi

Rate-limiting & brute-force protection using Redis

HTTP headers hardened with Helmet

Parameter pollution prevented with HPP

API structured with MVC & layered logic


📌 Final Note
This project is fully modular, scalable, and ready for deployment. You can extend it to include:

Admin Dashboard (Frontend)

Payment Integration

SMS Notifications

Analytics Dashboard

Made with ❤️ for real-world dental clinics.

🧑‍💻 Developer
Name: Mohamed Awad

GitHub: @Mohamedawad114

Email: mohamedahmedawad180@gmail.com

swagger UI :http://localhost:3000/api-docs/
