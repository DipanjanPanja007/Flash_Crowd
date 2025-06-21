import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEventNoti,
  createFriendRequestNoti,
} from "../controllers/notification.controller.js";

router.route("/friendReq").post(verifyJWT, createFriendRequestNoti);
router.route("/event").post(verifyJWT, createEventNoti);

export default router;
