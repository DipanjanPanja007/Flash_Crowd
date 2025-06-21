import express from "express";
const router = express.Router();
import { handleLogin, handleLogout } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  searchFriends,
  searchUsers,
  updateUserInfo,
} from "../controllers/user.controller.js";
import upload from "../utils/multer.js";

router.route("/login").post(handleLogin);
router.route("/logout").post(handleLogout);
router
  .route("/update")
  .post(verifyJWT, upload.single("profilePicture"), updateUserInfo);
router.route("/search").get(verifyJWT, searchUsers);
router.route("/search/friends").get(verifyJWT, searchFriends);

export default router;
