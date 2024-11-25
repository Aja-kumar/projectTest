import bcryptjs from "bcryptjs";
import User from "../models/authModels.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// genrate token
const genrateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed file extensions
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"));
    }
  },
});

// signup functionality
export const signupController = async (req, res) => {
  try {
    const { username, email, password, role, userProfile } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ message: "user already exist!" });
    }
    if (!username && !password && !email) {
      return res.status(401).json({ message: "please enter all fields" });
    }
    if (password.length < 6) {
      return res
        .status(401)
        .json({ message: "password should be greater than 6 letters!" });
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      role,
      userProfile,
    });

    //genrate new token
    const token = genrateToken(newUser._id);
    // console.log(token);
    res.cookie("Access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(201).json({
      message: "user created successfully",
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        userProfile: newUser.userProfile,
        password: newUser.password,
      },
    });
  } catch (error) {
    console.log("signup error", error.message);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

// login controller functionality
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }
    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Incorrect password!" });
    } else {
      //genrate new token
      const token = genrateToken(user._id);
      console.log(token);
      res.cookie("Access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      // console.log(token);
      return res.status(200).json({ data: user });
    }
  } catch (error) {
    console.log("signup error", error.message);
    return res
      .status(500)
      .json({ message: "server error", error: "error.message" });
  }
};

// logout controller
export const logoutController = async (req, res) => {
  try {
    const AccessToken = req.cookies.Access_token;
    if (AccessToken) {
      const decoded = jwt.verify(AccessToken, process.env.JWT_SECRET);
    }
    res.clearCookie("Access_token");
    return res.status(201).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("logout error", error.message);
    return res
      .status(500)
      .json({ message: "server error", error: "error.message" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username } = req.body;

    if (!userId || !username) {
      return res.status(400).json({
        message: "Invalid user details",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = username;
    if (req.file) {
      user.userProfile = req.file.filename; // Save the uploaded file's name
    }

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const GetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json({ user });
    } else {
      return res
        .status(404)
        .json({ message: "User not found", error: error.message });
    }
  } catch (error) {
    console.error("Get user error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
