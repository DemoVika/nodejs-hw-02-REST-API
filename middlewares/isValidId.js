const isValidObjectId = require("mongoose").isValidObjectId;

const { HttpError } = require("../helpers/index");

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`));
  }
  next();
};

module.exports = { isValidId };
