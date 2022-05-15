const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [40, "Name should be under 40 characters"],
    },
    desc: {
      type: String,
      required: [true, "Please provide a Description"],
    },
    like: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comment: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Post", postSchema);
