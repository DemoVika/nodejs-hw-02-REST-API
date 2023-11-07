const express = require("express");
const {
  signup,
  changeAvatar,
  signin,
  getCurrent,
  signout,
  verify,
  resendVerifyEmail,
} = require("../controlers/authControlers");
const { authenticate, upload } = require("../middlewares/index");
const { validateBody } = require("../decorators/index");
const {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
} = require("../utils/validations/contactValidationSchemas");
const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userEmailValidate = validateBody(userEmailSchema);

const authRouter = express.Router(); //создали обьект куда бдем добавлять руты

authRouter.post("/signup", userSignupValidate, signup);
authRouter.post("/signin", userSigninValidate, signin);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/signout", authenticate, signout);
authRouter.patch(
  "/users/avatars",
  upload.single("avatar"),
  authenticate,
  changeAvatar
);
authRouter.get("/verify/:verificationToken", verify);
authRouter.post("/verify", userEmailValidate, resendVerifyEmail);

module.exports = { authRouter };
