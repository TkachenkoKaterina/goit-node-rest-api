import Joi from "joi";

export const usersRegister = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

export const usersLogin = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  token: Joi.string().allow(null),
});
