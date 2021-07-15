const router = require("express").Router();
const School = require("../models/schoolModel");
const { hasRole } = require("../middleware/rbac");

router.post("/create", hasRole("school-create"), async (req, res) => {
  try {
    const { name, city, state, country } = req.body;
    if (!name || !city || !state || !country) {
      return res.status(400).json({ message: "Please add all the details" });
    }
    const school = new School({ name, city, state, country });
    await school.save();
    res.status(201).json({ message: "School has been created", data: school });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/all", hasRole("school-get"), async (req, res) => {
  try {
    const schools = await School.find();
    res.status(200).json({ data: schools });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/students", hasRole("school-students"), async (req, res) => {
  try {
    const schools = await School.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "schoolId",
          as: "students", 
        },
      },
    ]);
    res.status(200).json({ data: schools });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
