const router = require("express").Router();
const Role = require("../models/roleModel");
const { hasRole } = require("../middleware/rbac");

router.post("/create", async (req, res) => {
  try {
    const { name, scopes } = req.body;
    if (!name || !scopes) {
      return res.status(400).json({ message: "Please add all the details" });
    }
    const role = new Role({ name, scopes });
    await role.save();
    res.status(201).json({ message: "Role has been created", data: role });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/all", hasRole("role-get"), async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
