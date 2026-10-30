require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const departmentRouter = require("./routers/departmentRouter");
const requestRouter = require("./routers/requestRouter");
const userRouter = require("./routers/userRouter");
console.log("Department router loaded");
const deviceRouter = require("./routers/deviceRouter");

app.use(cors());
app.use(express.json());
app.use("/api/departments", departmentRouter);
app.use("/api/requests", requestRouter);
app.use("/api/users", userRouter);
app.use("/api/devices", deviceRouter);

console.log("Department route mounted");

app.get("/", (req, res) => {
  res.send("KAUH Request Management System API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is working",
  });
});

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });
