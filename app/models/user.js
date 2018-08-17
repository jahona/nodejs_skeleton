"use strict";

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, required: true },
  userPw: { type: String, required: true },
  nickname: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.verifyPassword = function(userPw) {
  return this.userPw === userPw;
};

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("user", userSchema);
