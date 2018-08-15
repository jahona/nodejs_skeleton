"use strict";

const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
const User = require("../../models/user");

module.exports = {
  login: async (req, res, next) => {
    const { userId, userPw } = req.value.body;
    let user;

    user = await User.findOne({
      userId: userId
    });

    if (!user) {
      return res.status(404).json({
        error: {
          message: "user-not-found",
          code: 0
        }
      });
    }

    if (!user.verifyPassword(userPw)) {
      res.status(404).json({
        error: {
          message: "password-not-match",
          code: 1
        }
      });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
        permission: user.permission
      },
      env.jwt_secret,
      {
        expiresIn: "2h"
      }
    );

    user.userPw = undefined;

    res.status(200).json({
      user: user,
      token: token
    });
  }
};
