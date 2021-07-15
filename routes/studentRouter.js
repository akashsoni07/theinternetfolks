const router = require("express").Router();
const Student = require("../models/studentModel");
const { hasRole } = require("../middleware/rbac");

router.post("/create", hasRole("student-create"), async (req, res) => {
  try {
    const { name, userId, schoolId } = req.body;
    if (!name || !userId || !schoolId) {
      return res.status(400).json({ message: "Please add all the details" });
    }
    const student = new Student({ name, userId, schoolId });
    await student.save();
    res
      .status(201)
      .json({ message: "Student has been created", data: student });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/all", hasRole("student-get"), async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ data: students });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
