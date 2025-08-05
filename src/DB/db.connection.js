import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();
const db_url=process.env.DB_URL

const db_connection=async () => {
try {
  await mongoose.connect(db_url);
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}}


export default db_connection;

