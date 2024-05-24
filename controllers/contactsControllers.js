import fs from "fs/promises";
import path from "path";

import * as contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const avatarsPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const filter = { owner };
  const fields = "-createdAt -updatedAt";
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const settingsParams = { skip, limit, favorite };
  const result = await contactsService.listContacts({
    filter,
    fields,
    settingsParams,
  });

  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.getContact({ _id, owner });

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const imgPath = path.join("public", "avatars", filename);

  const result = await contactsService.addContact({
    ...req.body,
    avatarURL: imgPath,
    owner,
  });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateContact({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.removeContact({ _id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
};

const updateFavoriteStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactsService.updateStatusContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavoriteStatusContact: ctrlWrapper(updateFavoriteStatusContact),
};
