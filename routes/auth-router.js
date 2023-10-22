const express = require("express");
const {
  signup,
  signin,
  getCurrent,
  signout,
} = require("../controlers/authControlers");
const { authenticate } = require("../middlewares/index");
const { validateBody } = require("../decorators/index");
const { userSignupSchema, userSigninSchema } = require("../db/User");

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);

const authRouter = express.Router(); //создали обьект куда бдем добавлять руты

authRouter.post("/signup", userSignupValidate, signup);
authRouter.post("/signin", userSigninValidate, signin);
authRouter.post("/current", authenticate, getCurrent);
authRouter.post("/signout", authenticate, signout);

module.exports = { authRouter };
