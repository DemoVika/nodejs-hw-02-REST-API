const { User } = require("../db/User");
const { HttpError, sendEmail } = require("../helpers/index");
const { controllerWrapper } = require("../decorators/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET, BASE_URL } = process.env;
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl: gravatar.url(email),
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    avatarUrl: gravatar.url(email),
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404);
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({ message: "Verify success" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email already verify");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token }); // если пароли совпали отправляем на фронт токен
};

const getCurrent = async (req, res) => {
  const { email } = req.user;

  res.json({ email });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Signout success" });
};

const changeAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw HttpError(401, "Not authorized");
  }

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);
  const image = await Jimp.read(newPath);
  image.resize(250, 250);
  await image.writeAsync(newPath);

  const avatarUrl = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarUrl: avatarUrl });

  res.json({
    message: `"avatar": ${avatarUrl}`,
  });
};

module.exports = {
  signup: controllerWrapper(signup),
  verify: controllerWrapper(verify),
  resendVerifyEmail: controllerWrapper(resendVerifyEmail),
  signin: controllerWrapper(signin),
  getCurrent: controllerWrapper(getCurrent),
  signout: controllerWrapper(signout),
  changeAvatar: controllerWrapper(changeAvatar),
};
