import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import { usersRegister, usersLogin } from "../schemas/authSchema.js";
import authController from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  isEmptyBody,
  validateBody(usersRegister),
  authController.register
);

authRouter.post(
  "/users/login",
  isEmptyBody,
  validateBody(usersLogin),
  authController.login
);

export default authRouter;
