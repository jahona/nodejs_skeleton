"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  content: { type: String },
  author_id: { type: Schema.Types.ObjectId, required: true },
  nickname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("chat", chatSchema);
