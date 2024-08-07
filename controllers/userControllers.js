const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helper/authHelper");
const usermodel = require("../models/userModel.js");
var { expressjwt: jwt } = require("express-jwt");
//Middleware for JWT
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
}); // by Default Algorithm is HS256

// Register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // validation

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).send({
        success: false,
        message: "Please required @",
      });
    }

    if (!email.endsWith(".com")) {
      return res.status(400).send({
        success: false,
        message: "Please is required .com",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and 6 character long",
      });
    }

    // existing user

    const existingUSer = await usermodel.findOne({ email });

    if (existingUSer) {
      return res.status(500).send({
        success: false,
        message:
          "User Already Register With this Email Change Your Email Or Goto Login Page",
      });
    }

    //hashed password
    const hashedPassword = await hashPassword(password);

    // save user
    const user = await usermodel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registeration Successfull please login",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

// login || GET Request

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // validation
      return res.status(500).send({
        success: false,
        message: "Please Provide Email ✉ and Password 🔐 ",
      });
    }

    // find user

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User 🤷‍♂️ Not Found",
      });
    }

    //Match password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid 🙅‍♂️ username or password",
      });
    }

    // Token JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // //undefined password from response
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login Successful ✔",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // user find
    const user = await usermodel.findOne({ email });

    //Password validation
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    // Update user
    const updatedUser = await usermodel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined; // Password not show to sending the response
    res.status(200).send({
      success: true,
      message: "User Updated Successfully Please Login Again",
      updatedUser, // we don't send password in response  because it's hashed in database.  "new" option is true to return updated user.  "new: false" will return original user.  "new: true" will return updated user.  "new: false" is default.  "new: false" means we don't send the updated user to the client.  "new: true" means we send the updated user to the client.  "new: false" is default.  "new: false" means we don't send the updated user to the client.  "new: true" means we send the updated user to the client.  "new: false" is default.  "new: false" means we don't send the updated user to the client.  "new: true" means we send the updated user to the client.  "
    }); // no need to send password in response  because it's hashed in database.  "new
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Update User API",
      error,
    });
  }
};

module.exports = {
  requireSignIn,
  registerController,
  loginController,
  updateUserController,
};
