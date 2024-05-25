import User from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = (filter) => {
  const user = User.findOne(filter);
  return user;
};

export const saveUser = async (data) => {
  console.log("data :>> ", data);
  const hashResult = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashResult });
};

export const updateUser = (filter, data) =>
  User.findOneAndUpdate(filter, data, { new: true });
