const { Contact } = require("../db/contacts-schema");

const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  // const { page = 1, limit = 10 } = req.query;
  // const skip = (page - 1) * limit;
  const contacts = await Contact.find(
    { owner }
    // { skip, limit }
  ).populate("owner", "email");
  res.json(contacts);
};

const getOneContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  try {
    const contact = await Contact.findOne({ _id: id, owner });
    res.json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const createContact = async (req, res, next) => {
  console.log(req.user);
  const { _id: owner } = req.user;
  try {
    const newContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      req.body
    );
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const deleteContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  try {
    const { id } = req.params;
    await Contact.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

module.exports = {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
};
