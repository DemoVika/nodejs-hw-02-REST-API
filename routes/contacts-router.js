const express = require("express");
const {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controlers/contactControlers");
// const router = express.Router();
const { authenticate, isValidId } = require("../middlewares/index");
const { validateBody } = require("../decorators/index");
const { schema, schemaFav } = require("../db/contacts-schema");

const contactAddValidate = validateBody(schema);
const contactUpdateFavValidate = validateBody(schemaFav);

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.post("/", contactAddValidate, createContact);

contactsRouter.put("/:id", isValidId, contactAddValidate, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  contactUpdateFavValidate,
  updateContact
);

contactsRouter.delete("/:id", isValidId, deleteContact);

module.exports = { contactsRouter };
