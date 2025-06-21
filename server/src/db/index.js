import { connect } from "mongoose";
import { _env } from "../constant.js";

export default async function connectDB() {
  try {
    await connect(`${_env.MONGODB_URI}`);
    console.log("Database connection successful!");
  } catch (error) {
    console.log("DB connection error : \n", error);
  }
}
