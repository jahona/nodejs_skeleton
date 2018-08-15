"use strict";

module.exports = {
  getUserList: async (req, res, next) => {
    res.json({
      success: "getUserList"
    });
  },

  createUser: async (req, res, next) => {
    res.json({
      success: "createUser"
    });
  },

  getUser: async (req, res, next) => {
    res.json({
      success: "getUser"
    });
  },

  updateUser: async (req, res, next) => {
    res.json({
      success: "updateUser"
    });
  },

  deleteUser: async (req, res, next) => {
    res.json({
      success: "deleteUser"
    });
  }
};
