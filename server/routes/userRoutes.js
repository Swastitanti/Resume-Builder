import express from "express";
import {
  getUserById,
  getUserResume,
  LoginUser,
  registerUser,
} from "../controllers/UserController.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", LoginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResume);

export default userRouter;