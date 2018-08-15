// modules
const express = require("express");
const router = require("express-promise-router")();
const Joi = require("joi");

// controllers
const AuthController = require("../controllers/user/auth");

// middlewares
const {
  validateParam,
  validateBody,
  schemas
} = require("../helpers/routeHelpers");

// helpers

// Jois
const authSchema = Joi.object().keys({
  userId: Joi.string().required(),
  userPw: Joi.string().required()
});

// routers
router.route("/login").post(validateBody(authSchema), AuthController.login);

module.exports = router;
