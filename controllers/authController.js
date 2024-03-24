const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const JWT_SECRET = process.env.JWT_SECRET;

const createUser = async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      throw {
        message: "User already exists",
      };
    }
    let salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(req.body.password, salt);
    user = await UserModel.create({
      email: req.body.email,
      name: req.body.name,
      password: secPass,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    let data = {
      id: user._id,
      email: user.email,
    };

    jwtOptions = { expiresIn: "360h" };

    let authToken = jwt.sign(data, JWT_SECRET, jwtOptions);

    let jwtUserResponse = await UserModel.findByIdAndUpdate(
      user._id,
      { token: authToken },
      { new: true }
    );

    delete jwtUserResponse.password;

    res.status(200).json({
      status: true,
      data: jwtUserResponse,
      message: "User created successfully",
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({
      status: false,
      message: err.message,
      data: err,
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Invalid email and password provided",
      });
    }
    let user = await UserModel.findOne({ email });

    if (!user) {
      throw {
        message: "Email is not registered.",
      };
    }

    let passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw { message: "Wrong Credentials" };
    }
    let data = {
      user: {
        id: user._id,
        email: user.email,
      },
    };

    let jwtOptions = { expiresIn: "360h" };

    let authToken = jwt.sign(data, JWT_SECRET, jwtOptions);
    let jwtUserResponse = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { token: authToken },
      { new: true }
    );

    delete jwtUserResponse.token;

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Login Successful",
      data: jwtUserResponse,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: err.message,
      error: err,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    let userResponse = await UserModel.find().lean();

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Fetch user Successful",
      data: userResponse,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: err.message,
      error: err,
    });
  }
};

module.exports = {
  createUser,
  login,
  getUsers,
};
