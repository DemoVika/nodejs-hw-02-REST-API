const Joi = require("joi");
const myCustomJoi = Joi.extend(require("joi-phone-number"));

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const schema = Joi.object({
  id: Joi.string(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
  favorite: Joi.boolean(),
});

const schemaFav = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { userSignupSchema, userSigninSchema, schema, schemaFav };
