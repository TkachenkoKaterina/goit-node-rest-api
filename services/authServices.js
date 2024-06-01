import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const findUser = (filter) => {
  const user = User.findOne(filter);
  return user;
};

export const saveUser = async (data) => {
  const hashResult = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashResult });
};

export const updateUser = (filter, data) => {
  return User.findOneAndUpdate(filter, data, { new: true });
};
