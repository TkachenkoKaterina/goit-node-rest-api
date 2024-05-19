import Joi from "joi";

export const usersRegister = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
  email: Joi.string().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

export const usersLogin = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
  email: Joi.string().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  token: Joi.string().allow(null),
});
