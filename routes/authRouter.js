import express from "express";

import upload from "../middlewares/upload.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";

import validateBody from "../decorators/validateBody.js";

import {
  usersRegister,
  usersLogin,
  updateUserSubscriptionSchema,
} from "../schemas/authSchema.js";

import authController from "../controllers/authControllers.js";

import authenticate from "../middlewares/authenticate.js";

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

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("/users/logout", authenticate, authController.logout);

authRouter.patch(
  "/users",
  authenticate,
  isEmptyBody,
  validateBody(updateUserSubscriptionSchema),
  authController.updateSubscription
);

authRouter.patch(
  "/users/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default authRouter;
