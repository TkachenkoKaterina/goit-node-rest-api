import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

import { createToken } from "../helpers/jwt.js";

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { protocol: "https" });
  const newUser = await authServices.saveUser({ ...req.body, avatarURL });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  try {
    await fs.rename(oldPath, newPath);
    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);

    const avatarURL = path.join("avatars", filename).replace(/\\/g, "/"); // Ensure the path uses forward slashes

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
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
