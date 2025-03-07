const express = require("express");
const {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controlers/contactControlers");
const { authenticate, isValidId, upload } = require("../middlewares/index");
const { validateBody } = require("../decorators/index");
const {
  schema,
  schemaFav,
} = require("../utils/validations/contactValidationSchemas");

const contactAddValidate = validateBody(schema);
const contactUpdateFavValidate = validateBody(schemaFav);

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.post(
  "/",
  upload.single("avatar"),
  contactAddValidate,
  createContact
);

contactsRouter.put("/:id", isValidId, contactAddValidate, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  contactUpdateFavValidate,
  updateContact
);

contactsRouter.delete("/:id", isValidId, deleteContact);

module.exports = { contactsRouter };
