require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const DB_URL = process.env.DB_URL; 
mongoose 
  .connect(DB_URL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false 
  })
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", require("./routes/userRouter"));
app.use("/api/role", require("./routes/roleRouter"));
app.use("/api/student", require("./routes/studentRouter"));
app.use("/api/school", require("./routes/schoolRouter"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
