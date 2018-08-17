// modules
const express = require("express");
const router = require("express-promise-router")();
const Joi = require("joi");

// controllers
const ChatsController = require("../controllers/chat/chats");

// middlewares
const AuthMiddleware = require("../middlewares/authMiddleware");

// helpers
const {
  validateParam,
  validateBody,
  schemas
} = require("../helpers/routeHelpers");

// Jois
const chatSchema = Joi.object().keys({
  content: Joi.string()
});

const chatOptionalSchema = Joi.object().keys({
  content: Joi.string()
});

// routers
router
  .route("/")
  .get(ChatsController.getChatList)
  .post([AuthMiddleware, validateBody(chatSchema)], ChatsController.createChat);

router
  .route("/:uid")
  .get(
    [AuthMiddleware, validateParam(schemas.idSchema, "uid")],
    ChatsController.getChat
  )
  .put(
    [
      AuthMiddleware,
      validateParam(schemas.idSchema, "uid"),
      validateBody(chatOptionalSchema)
    ],
    ChatsController.updateChat
  )
  .delete(
    [AuthMiddleware, validateParam(schemas.idSchema, "uid")],
    ChatsController.deleteChat
  );

module.exports = router;
