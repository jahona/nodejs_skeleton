"use strict";

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  content: { type: String },
  author_id: { type: Schema.Types.ObjectId, required: true },
  nickname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

chatSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("chat", chatSchema);
