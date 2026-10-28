const express = require("express");
const router = express.Router();

const Request = require("../models/Request");

router.post("/", async (req, res) => {
  try {
    const request = new Request({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      requestedBy: req.body.requestedBy,
      department: req.body.department,
    });

    await request.save();

    res.status(201).json({
      message: "Request created successfully",
      request: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create request",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const requests = await Request.find();

    res.status(200).json({
      message: "Requests retrieved successfully",
      requests: requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve requests",
      error: error.message,
    });
  }
});


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
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.status(200).json({
      message: "Request updated successfully",
      request: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update request",
      error: error.message,
    });
  }
});


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
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete request",
      error: error.message,
    });
  }
});



module.exports = router;
