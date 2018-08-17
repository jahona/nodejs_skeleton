"use strict";

const Room = require("../../models/room");
const User = require("../../models/user");

module.exports = {
  getRoomList: async (req, res, next) => {
    const rooms = await Room.find({});

    res.status(200).json(rooms);
  },

  createRoom: async (req, res, next) => {
    const { body } = req.value;

    let room;

    const newRoom = new Room(body);

    const user = await User.findById(req.decoded._id);

    if (!newRoom.participants) {
      room.participants = [];
    }

    newRoom.participants.push({
      user_id: user._id,
      nickname: user.nickname
    });

    newRoom.owner_id = user._id;

    room = await newRoom.save();

    res.status(200).json(room);
  },

  getRoom: async (req, res, next) => {
    const { uid } = req.value.params;

    const room = await Room.findById(uid);

    if (!room) {
      return res.status(404).json({
        error: {
          message: "room-not-found",
          code: 0
        }
      });
    }

    res.status(200).json(room);
  },

  updateRoom: async (req, res, next) => {
    const { uid } = req.value.params;
    const { body } = req.value;

    const room = await Room.findByIdAndUpdate(uid, body, {
      new: true
    });

    if (!room) {
      return res.status(404).json({
        error: {
          message: "room-not-found",
          code: 0
        }
      });
    }

    const user = await User.findById(req.decoded._id);

    if (!room.owner_id.equals(user._id)) {
      return res.status(403).json({
        error: "permission-denied",
        code: 0
      });
    }

    room.updatedAt = Date.now();

    res.status(200).json(room);
  },

  deleteRoom: async (req, res, next) => {
    const { uid } = req.value.params;

    const room = await Room.findById(uid);
    if (!room) {
      return res.status(404).json({
        error: {
          message: "room-not-found",
          code: 0
        }
      });
    }

    if (!room.owner_id.equals(user._id)) {
      return res.status(403).json({
        error: "permission-denied",
        code: 0
      });
    }

    await Room.remove({ _id: uid });

    res.status(200).json({
      success: {
        message: "success-delete-room"
      }
    });
  },

  enterInRoom: async (req, res, next) => {
    const { uid } = req.value.params;

    const room = await Room.findById(uid);
    if (!room || room.isParticiable === false) {
      return res.status(404).json({
        error: {
          message: "room-not-found",
          code: 0
        }
      });
    }

    const user = await User.findById(req.decoded._id);

    for (var i = 0; i < room.participants.length; i++) {
      if (
        room.participants[i].user_id.equals(user._id) &&
        !user._id.equals(room.owner_id)
      ) {
        return res.status(400).json({
          error: "UserId-already-existed-In-Room",
          code: 0
        });
      }
    }

    if (room.participants.length < room.maximumPeople) {
      room.participants.push({
        user_id: user._id,
        nickname: user.nickname
      });
    }

    if (room.participants.length == room.maximumPeople) {
      room.isParticiable = false;
    }

    await room.save();

    return res.status(200).json(room);
  },

  exitInRoom: async (req, res, next) => {
    const { uid } = req.value.params;

    const room = await Room.findById(uid);
    if (!room) {
      return res.status(404).json({
        error: {
          message: "room-not-found",
          code: 0
        }
      });
    }

    const user = await User.findById(req.decoded._id);

    for (var i = 0; i < room.participants.length; i++) {
      if (room.participants[i].user_id.equals(user._id)) {
        room.participants.splice(i, 1);
      }
    }

    // 0명이면 방 삭제
    if (room.participants.length === 0) {
      await room.remove();
      return res.status(200).json({
        success: {
          messsage: "room-remove",
          code: 0
        }
      });
    }

    // 방장이 나갔으면 방장 변경
    if (room.owner_id.equals(user._id)) {
      room.owner_id = room.participants[0];
    }

    room.isParticiable = true;
    await room.save();

    res.status(200).json(room);
  }
};
