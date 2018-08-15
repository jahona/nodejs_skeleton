"use strict";

const User = require("../../models/user");

module.exports = {
  getUserList: async (req, res, next) => {
    const users = await User.find({}).select("-userPw");

    res.status(200).json(users);
  },

  createUser: async (req, res, next) => {
    let user;

    user = await User.findOne({ userId: req.body.userId });

    if (user) {
      return res.status(409).json({
        error: "UserId-already-existed",
        code: 0
      });
    }

    const newUser = new User(req.body);

    user = await newUser.save();

    res.status(200).json(user);
  },

  getUser: async (req, res, next) => {
    const { uid } = req.params;

    const user = await User.findById(uid, { userPw: false });

    if (!user) {
      return res.status(404).json({
        error: {
          message: "user-not-found",
          code: 0
        }
      });
    }

    res.status(200).json(user);
  },

  updateUser: async (req, res, next) => {
    const { uid } = req.params;

    const user = await User.findByIdAndUpdate(uid, req.body, {
      new: true
    }).select("-userPw");

    if (!user) {
      return res.status(404).json({
        error: {
          message: "user-not-found",
          code: 0
        }
      });
    }

    res.status(200).json(user);
  },

  deleteUser: async (req, res, next) => {
    const { uid } = req.params;

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({
        error: {
          message: "user-not-found",
          code: 0
        }
      });
    }

    await User.remove({ _id: uid });

    res.status(200).json({
      success: {
        message: "success-delete-user"
      }
    });
  }
};