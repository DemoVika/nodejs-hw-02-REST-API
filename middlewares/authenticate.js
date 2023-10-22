const { HttpError } = require("../helpers/index");
const { controllerWrapper } = require("../decorators/index");
const { User } = require("../db/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" "); // возвращает массив из 2 слов
  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpError(401, "Not authorized");
    }
    req.user = user; // дописываем свойство в обьект user
    next();
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = { authenticate: controllerWrapper(authenticate) };
