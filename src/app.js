import express from "express";
import hpp from "hpp";
import helmet from "helmet";
import env from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import db_connection from "./DB/db.connection.js";
import users_router from "./modules/Users/users.controllor.js";
import books_router from "./modules/Books/books.controllor.js";
import clinic_router from "./modules/Clinic/Clinic.controllor.js";
import advice_router from "./modules/Advices/advice.cotrollor.js";
import doctor_router from "./modules/Doctors/doctor.controllor.js";
import review_router from "./modules/reviews/review.controllor.js";
import { swaggerDocs } from "../swagger.js";
import "./utiles/cronJop.js";
const app = express();
app.use(helmet());
env.config();
app.use(hpp());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));

app.use("/users", users_router);
app.use("/Books", books_router);
app.use("/doctors", doctor_router);
app.use("/clinic", clinic_router);
app.use("/advices", advice_router);
app.use("/reviews", review_router);

await db_connection();

swaggerDocs(app);
app.use((err, req, res, next) => {
  res
    .status(err.cause || 500)
    .json({ message: `something wrong`, err: err.message, stack: err.stack });
});

app.use((req, res) => {
  res.status(404).json({ message: `Page Not Found` });
});

export default app;
