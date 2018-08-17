"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  participants: [
    {
      user_id: { type: Schema.Types.ObjectId, required: true },
      nickname: { type: String, required: true }
    }
  ],
  owner_id: { type: Schema.Types.ObjectId, required: true },
  isParticiable: { type: Boolean, default: true },
  maximumPeople: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("room", roomSchema);
