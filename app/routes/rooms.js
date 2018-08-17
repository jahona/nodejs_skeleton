// modules
const express = require("express");
const router = require("express-promise-router")();
const Joi = require("joi");

// controllers
const RoomsController = require("../controllers/chat/rooms");

// middlewares
const AuthMiddleware = require("../middlewares/authMiddleware");

// helpers
const {
  validateParam,
  validateBody,
  schemas
} = require("../helpers/routeHelpers");

// Jois
const roomSchema = Joi.object().keys({
  title: Joi.string().required(),
  maximumPeople: Joi.number()
});

const roomOptionalSchema = Joi.object().keys({
  title: Joi.string(),
  maximumPeople: Joi.number()
});

// routers
router
  .route("/")
  .get(RoomsController.getRoomList)
  .post([AuthMiddleware, validateBody(roomSchema)], RoomsController.createRoom);

router
  .route("/:uid")
  .get(
    [AuthMiddleware, validateParam(schemas.idSchema, "uid")],
    RoomsController.getRoom
  )
  .put(
    [
      AuthMiddleware,
      validateParam(schemas.idSchema, "uid"),
      validateBody(roomOptionalSchema)
    ],
    RoomsController.updateRoom
  )
  .delete(
    [AuthMiddleware, validateParam(schemas.idSchema, "uid")],
    RoomsController.deleteRoom
  );

router
  .route("/enter/:uid")
  .put(
    [AuthMiddleware, validateParam(schemas.idSchema, "uid")],
    RoomsController.enterInRoom
  );

router
  .route("/exit/:uid")
  .put(
    [AuthMiddleware, validateParam(schemas.idSchema, "uid")],
    RoomsController.exitInRoom
  );

module.exports = router;
