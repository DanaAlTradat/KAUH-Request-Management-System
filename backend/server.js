
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
const departmentRouter = require("./routers/departmentRouter") 
console.log("Department router loaded") 

app.use(cors())
app.use(express.json())
app.use("/api/departments", departmentRouter)
 app.get("/check-route", (req, res) => {
  res.send("CHECK ROUTE WORKS")
})
app.get("/test-server", (req, res) => {
  res.send("Test server route works")
})
console.log("Department route mounted")

app.get("/", (req, res) => {
  res.send("KAUH Request Management System API is running")
})

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is working"
  })
})

mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("MongoDB connected successfully")

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000")
    })
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message)
  })
