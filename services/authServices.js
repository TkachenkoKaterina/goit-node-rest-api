import User from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = (filter) => User.findOne(filter);

export const saveUser = async (data) => {
  const hashResult = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashResult });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
