const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailToken: {
    type: String,
  },
  emailTokenExpiry: {
    type: Date,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  realName: {
    type: String,
    default: "",
    required: false,
  },
  profilePicName: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  FollowersList: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdPodcasts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Podcast",
    },
  ],
  createdAlbums: [
    {
      type: Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  favouritePodcasts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Podcast",
    },
  ],
  favouriteAlbums: [
    {
      type: Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  podcasterFollowed: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

UserSchema.index({ username: 1 }); // mongoose autimatically uses this when findbyone operation is done on username for login purpose
UserSchema.index({ username: "text" }); // mongoose uses this while searching in app for username automatically

const User = mongoose.model("User", UserSchema);

module.exports = User;
