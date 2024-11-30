import express from "express";
import {
  GetUser,
  loginController,
  logoutController,
  signupController,
  updateUser,
} from "../controller/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { upload } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.post("/logout", logoutController);

router.put("/:id", upload.single("profileImage"), updateUser);

router.get("/:id", GetUser);

export default router;
