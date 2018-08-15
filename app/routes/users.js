// modules
const express = require("express");
const router = require("express-promise-router")();
const Joi = require("joi");

// controllers
const UsersController = require("../controllers/user/users");

// middlewares

// helpers
const {
  validateParam,
  validateBody,
  schemas
} = require("../helpers/routeHelpers");

// Jois
const userSchema = Joi.object().keys({
  userId: Joi.string().required(),
  userPw: Joi.string().required(),
  userName: Joi.string()
});

const userOptionalSchema = Joi.object().keys({
  userPw: Joi.string(),
  userName: Joi.string()
});

// routers
router
  .route("/")
  .get(UsersController.getUserList)
  .post(validateBody(userSchema), UsersController.createUser);

router
  .route("/:uid")
  .get(validateParam(schemas.idSchema, "uid"), UsersController.getUser)
  .put(
    [validateParam(schemas.idSchema, "uid"), validateBody(userOptionalSchema)],
    UsersController.updateUser
  )
  .delete(validateParam(schemas.idSchema, "uid"), UsersController.deleteUser);

module.exports = router;
