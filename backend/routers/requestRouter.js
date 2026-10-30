
const express = require("express");
const router = express.Router();

const Request = require("../models/Request");

// POST: Create a new request
router.post("/", async (req, res) => {
  try {
    const request = new Request({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      requestedBy: req.body.requestedBy,
      department: req.body.department,
      device: req.body.device || null,
    });

    await request.save();

    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create request",
      error: error.message,
    });
  }
});

// GET: Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("requestedBy", "name email")
      .populate("department", "name")
      .populate("device", "name category assetTag status");

    res.status(200).json({
      message: "Requests retrieved successfully",
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve requests",
      error: error.message,
    });
  }
});

// GET: Get one request by ID
router.get("/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("requestedBy", "name email")
      .populate("department", "name")
      .populate("device", "name category assetTag status");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.status(200).json({
      message: "Request retrieved successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve request",
      error: error.message,
    });
  }
});

// PUT: Update a request
router.put("/:id", async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        status: req.body.status,
        department: req.body.department,
        device: req.body.device || null,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("requestedBy", "name email")
      .populate("department", "name")
      .populate("device", "name category assetTag status");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.status(200).json({
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update request",
      error: error.message,
    });
  }
});

// DELETE: Delete a request
router.delete("/:id", async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.status(200).json({
      message: "Request deleted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete request",
      error: error.message,
    });
  }
});

module.exports = router;
