"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, required: true },
  userPw: { type: String, required: true },
  userName: { type: String }
});

userSchema.methods.verifyPassword = function(userPw) {
  return this.userPw === userPw;
};

module.exports = mongoose.model("user", userSchema);
