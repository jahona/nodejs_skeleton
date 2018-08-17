"use strict";

const Room = require("../../models/room");
const Chat = require("../../models/chat");
const User = require("../../models/user");

module.exports = {
  // TODO: 한번에 몇개의 데이터를 보내줄것인지.
  getChatList: async (req, res, next) => {
    const chats = await Chat.find({});

    res.status(200).json(chats);
  },

  createChat: async (req, res, next) => {
    const { body } = req.value;

    let chat;

    const newChat = new Chat(body);

    const user = await User.findById(req.decoded._id);

    newChat.author_id = user._id;
    newChat.nickname = user.nickname;

    chat = await newChat.save();

    res.status(200).json(chat);
  },

  getChat: async (req, res, next) => {
    const { uid } = req.value.params;

    const chat = await Chat.findById(uid);

    if (!chat) {
      return res.status(404).json({
        error: {
          message: "chat-not-found",
          code: 0
        }
      });
    }

    res.status(200).json(chat);
  },

  updateChat: async (req, res, next) => {
    const { uid } = req.value.params;
    const { body } = req.value;

    const chat = await Chat.findByIdAndUpdate(uid, body, {
      new: true
    });

    if (!chat) {
      return res.status(404).json({
        error: {
          message: "chat-not-found",
          code: 0
        }
      });
    }

    const user = await User.findById(req.decoded._id);

    if (!chat.author_id.equals(user._id)) {
      return res.status(403).json({
        error: "permission-denied",
        code: 0
      });
    }

    chat.updatedAt = Date.now();
    await chat.save();

    res.status(200).json(chat);
  },

  deleteChat: async (req, res, next) => {
    const { uid } = req.value.params;

    const chat = await Chat.findById(uid);
    if (!chat) {
      return res.status(404).json({
        error: {
          message: "chat-not-found",
          code: 0
        }
      });
    }

    const user = await User.findById(req.decoded._id);

    if (!chat.author_id.equals(user._id)) {
      return res.status(403).json({
        error: "permission-denied",
        code: 0
      });
    }

    await Chat.remove({ _id: uid });

    res.status(200).json({
      success: {
        message: "success-delete-chat"
      }
    });
  }
};
