const express = require("express");
const {
  signup,
  changeAvatar,
  signin,
  getCurrent,
  signout,
} = require("../controlers/authControlers");
const { authenticate, upload } = require("../middlewares/index");
const { validateBody } = require("../decorators/index");
const {
  userSignupSchema,
  userSigninSchema,
} = require("../utils/validations/contactValidationSchemas");
const authControlers = require("../controlers/authControlers");
const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);

const authRouter = express.Router(); //создали обьект куда бдем добавлять руты

authRouter.post("/signup", userSignupValidate, signup);
authRouter.post("/signin", userSigninValidate, signin);
authRouter.post("/current", authenticate, getCurrent);
authRouter.post("/signout", authenticate, signout);
authRouter.patch(
  "/users/avatars",
  upload.single("avatarUrl"),
  authenticate,
  changeAvatar
);
module.exports = { authRouter };
