require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.hasRole = (scope) => {
  return (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "you must be logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      const { _id } = payload;
      User.findById(_id)
        .select("-password")
        .populate("roleId","scopes")
        .then((userData) => {
          req.user = userData;
          if (userData.roleId.scopes.includes(scope)) {
            next();
          } else {
            res.status(401).json({ message: "Access Denied" });
          }
        })
        .catch((error) => {
          console.log(error)
          res.status(401).json({ error });
        });
    });
  }; 
};
