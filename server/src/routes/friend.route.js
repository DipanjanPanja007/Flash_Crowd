import express from "express";
const router = express.Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getMyFriends,
  searchFriends,
  sendFriendRequest,
} from "../controllers/friend.controller.js";

router.route("/").get(verifyJWT, getMyFriends);
router.route("/search").get(verifyJWT, searchFriends);
router.route("/sendRequest").post(verifyJWT, sendFriendRequest);
router.route("/deleteRequest").delete(verifyJWT, deleteFriendRequest);
router.route("/acceptRequest").put(verifyJWT, acceptFriendRequest);


export default router;
