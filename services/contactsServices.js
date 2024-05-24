import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
  const { filter = {}, fields = "", settingsParams = {} } = search;
  const { skip, limit, favorite } = settingsParams;

  if (typeof favorite !== "undefined") {
    filter.favorite = favorite;
  }

  return Contact.find(filter, fields, settingsParams);
};

export const getContact = (filter) => {
  const result = Contact.findOne(filter);
  return result;
};

export const addContact = (data) => Contact.create(data);

export const updateContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);

export const updateStatusContact = (contactId, body) => {
  const { favorite } = body;
  const result = Contact.findByIdAndUpdate(contactId, { favorite });
  return result;
};
