
const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending"
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  }, 
  
device: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Device",
  default: null,
},

})



module.exports = mongoose.model("Request", requestSchema)
