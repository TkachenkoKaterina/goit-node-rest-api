import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.post("/", isEmptyBody, createContact);

contactsRouter.put("/:id", isEmptyBody, updateContact);

contactsRouter.delete("/:id", deleteContact);

export default contactsRouter;
