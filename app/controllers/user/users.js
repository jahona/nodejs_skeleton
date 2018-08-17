"use strict";

const User = require("../../models/user");

module.exports = {
  getUserList: async (req, res, next) => {
    let { page, limit } = req.params;

    if (!page) page = 1;
    if (!limit) limit = 10;

    let users = [];
    let pages;

    await User.paginate({}, { page: page, limit: limit }, function(
      err,
      result
    ) {
      users = result.docs;
      pages = result.pages;
    });

    res.status(200).json({
      users: users,
      totalPage: pages
    });
  },

  createUser: async (req, res, next) => {
    const { body } = req.value;

    let user;

    user = await User.findOne({ userId: body.userId });

    if (user) {
      return res.status(409).json({
        error: "UserId-already-existed",
        code: 0
      });
    }

    const newUser = new User(body);

    user = await newUser.save();

    res.status(200).json(user);
  },

  getUser: async (req, res, next) => {
    const { uid } = req.value.params;

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
    const { uid } = req.value.params;
    const { body } = req.value;

    const user = await User.findByIdAndUpdate(uid, body, {
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

    user.updatedAt = Date.now();

    res.status(200).json(user);
  },

  deleteUser: async (req, res, next) => {
    const { uid } = req.value.params;

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
