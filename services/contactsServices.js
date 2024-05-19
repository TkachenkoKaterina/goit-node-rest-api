import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
  const { filter = {}, fields } = search;
  return Contact.find({}, "-createAt -updateAt");
};

export const getContactById = async (contactId) => {
  const result = Contact.findById(contactId);
  return result;
};

export const addContact = (data) => Contact.create(data);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const updateStatusContact = (contactId, body) => {
  const { favorite } = body;
  const result = Contact.findByIdAndUpdate(contactId, { favorite });
  return result;
};
