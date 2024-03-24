const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
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
    status:{
      type: String,
      default: "active"
    },
    token:{
      type: String,
    }
  },
  { timestamp: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
