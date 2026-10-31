
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create User
router.post("/", async (req, res) => {
  try {
    const saltRounds = Number(process.env.SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      saltRounds
    );

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "employee",
      department: req.body.department,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
});

// Get User By ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
});

module.exports = router;
