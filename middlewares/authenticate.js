import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authServices.js";

const authenticate = async (req, res, next) => {
  const { autorization } = req.headers;
  if (!autorization) {
    return next(HttpError(401, "Not authorized"));
  }

  const [baerer, token] = autorization.split(" ");
  if (baerer !== "Baerer") {
    return next(HttpError(401, "Not authorized (Baerer not found)"));
  }

  try {
    const { id } = verifyToken(token);
    const user = await findUser({ _id: id });
    if (!user) {
      return next(HttpError(401, "Not authorized (User not found)"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};
export default authenticate;
