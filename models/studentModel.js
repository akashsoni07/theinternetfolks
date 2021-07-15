const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  schoolId: {
    type: ObjectId,
    ref: "School",
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
