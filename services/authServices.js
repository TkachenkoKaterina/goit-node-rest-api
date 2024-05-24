import User from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = (filter) => {
  const userQ = User.findOne(filter);
  return userQ;
};

export const saveUser = async (data) => {
  const hashResult = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashResult });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
