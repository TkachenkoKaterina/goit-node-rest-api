import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import Jimp from "jimp";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

import { createToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email, { protocol: "http" });

  const newUser = await authServices.saveUser({
    ...req.body,
    verificationToken,
    avatarURL,
  });

  const verifyEmail = {
    to: "tkachenko.city@gmail.com",
    from: "tkachenko_kateryna@meta.ua",
    subject: "First email by Node.js",
    text: "and easy to do anywhere, even with Node.js",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to verify your Email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await authServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );

  res.status(200).json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }

  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: "tkachenko.city@gmail.com",
    from: "tkachenko_kateryna@meta.ua",
    subject: "First email by Node.js",
    text: "and easy to do anywhere, even with Node.js",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click to verify your Email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "User not verify");
  }

  const compareResult = await bcrypt.compare(password, user.password);
  if (!compareResult) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = createToken(payload);
  await authServices.updateUser({ _id: id }, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.status(201).json();
};

const updateSubscription = async (req, res) => {
  const { _id: userId } = req.user;
  const { subscription } = req.body;

  const updatedUser = await authServices.updateUser(
    { _id: userId },
    { subscription }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  res.status(200).json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id: userId } = req.user;

  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  try {
    await fs.rename(oldPath, newPath);
    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);

    const avatarURL = path.join("avatars", filename).replace(/\\/g, "/");

    const updatedUser = await authServices.updateUser(
      { _id: userId },
      { avatarURL }
    );

    if (!updatedUser) {
      throw HttpError(401, "Not authorized");
    }

    res.status(200).json({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    throw HttpError(401, "Not authorized");
  }
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
