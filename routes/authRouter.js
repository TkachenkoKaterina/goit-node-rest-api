import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import { usersSchema } from "../schemas/authSchema.js";
import authController from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  isEmptyBody,
  validateBody(usersSchema),
  authController.register
);

// authRouter.post(
//   "/users/login",
//   isEmptyBody,
//   validateBody(usersSchema),
//   authController.login
// );

export default authRouter;
