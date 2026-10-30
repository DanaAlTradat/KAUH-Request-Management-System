
const express = require("express");
const router = express.Router();

const Device = require("../models/Device");

// GET: Get all devices
router.get("/", async (req, res) => {
  try {
    const devices = await Device.find().populate("department", "name");

    res.status(200).json({
      message: "Devices retrieved successfully",
      devices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve devices",
      error: error.message,
    });
  }
});

// GET: Get one device by ID
router.get("/:id", async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate("department", "name");

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    res.status(200).json({
      message: "Device retrieved successfully",
      device,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve device",
      error: error.message,
    });
  }
});

// POST: Create a device
router.post("/", async (req, res) => {
  try {
    const device = new Device({
      name: req.body.name,
      category: req.body.category,
      assetTag: req.body.assetTag,
      brand: req.body.brand,
      model: req.body.model,
      department: req.body.department,
      status: req.body.status,
      description: req.body.description,
    });

    await device.save();

    res.status(201).json({
      message: "Device created successfully",
      device,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Asset tag already exists",
      });
    }

    res.status(400).json({
      message: "Failed to create device",
      error: error.message,
    });
  }
});

// PUT: Update a device
router.put("/:id", async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    res.status(200).json({
      message: "Device updated successfully",
      device,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update device",
      error: error.message,
    });
  }
});

// DELETE: Delete a device
router.delete("/:id", async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    res.status(200).json({
      message: "Device deleted successfully",
      device,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete device",
      error: error.message,
    });
  }
});

module.exports = router;
