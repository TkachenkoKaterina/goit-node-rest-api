import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";
import { isValidId, isValidContactId } from "../middlewares/isValidId.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

import contactsControllers from "../controllers/contactsControllers.js";
import upload from "../middlewares/upload.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.post(
  "/",
  upload.single("avatar"),
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidContactId,
  isEmptyBody,
  validateBody(updateStatusContactSchema),
  contactsControllers.updateFavoriteStatusContact
);

export default contactsRouter;
