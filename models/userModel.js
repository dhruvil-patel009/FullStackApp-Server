const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please Enter Your Name"],
      trim: true,
    },

    email: {
      type: String,
      require: [true, "Please Enter Your Valid Emil"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      require: [true, "Please Enter Your Password"],
      min: 6,
      max: 50,
    },

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
