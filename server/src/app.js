import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import userRoute from "./routes/user.route.js";
import eventRoute from "./routes/event.route.js";

import { _env } from "./constant.js";

const app = express();

const origin = _env.ORIGIN?.split(",");

app.use(
  cors({
    origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public"));
app.use(compression());
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 100,
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Home",
  });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/event", eventRoute);

export default app;
