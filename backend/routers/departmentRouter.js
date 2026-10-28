
const express = require("express");
const router = express.Router();
console.log("DEPARTMENT ROUTER FILE LOADED");

const Department = require("../models/Department");

router.post("/", async (req, res) => {
  try {
    const department = new Department({
      name: req.body.name,
      description: req.body.description,
    });

    await department.save();

    res.status(201).json({
      message: "Department created successfully",
      department: department,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create department",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();

    res.status(200).json({
      message: "Departments retrieved successfully",
      departments: departments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve departments",
      error: error.message,
    });
  }
});

router.get("/test", (req, res) => {
  res.send("Department router works");
});

module.exports = router;
