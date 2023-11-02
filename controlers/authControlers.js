const { User } = require("../db/User");
const { HttpError } = require("../helpers/index");
const { controllerWrapper } = require("../decorators/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const gravatar = require("gravatar");
const Jimp = require("jimp");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl: gravatar.url(email),
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    avatarUrl: gravatar.url(email),
  });
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
    message: `"avatarUrl": ${avatarUrl}`,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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

module.exports = {
  signup: controllerWrapper(signup),
  signin: controllerWrapper(signin),
  getCurrent: controllerWrapper(getCurrent),
  signout: controllerWrapper(signout),
  changeAvatar: controllerWrapper(changeAvatar),
};
