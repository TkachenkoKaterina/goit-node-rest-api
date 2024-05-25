import express from "express";
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
  "/register",
  isEmptyBody,
  validateBody(usersRegister),
  authController.register
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(usersLogin),
  authController.login
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(updateUserSubscriptionSchema),
  authController.updateSubscription
);

export default authRouter;
