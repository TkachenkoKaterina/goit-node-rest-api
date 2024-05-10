import HttpError from "../helpers/HttpError.js";

const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(res.body);
  if (!length) {
    return next(HttpError(400, "Body must have at least one field"));
  }
  next();
};
export default isEmptyBody;
