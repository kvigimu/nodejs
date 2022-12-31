const express = require("express");
var bodyParser = require("body-parser");
const userRoutes = require("./api/routes/user");
const ticketRoutes = require("./api/routes/ticket");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);

var cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })
  .then(console.log("coneccted"))
  .catch((err) => {
    console.log("xxxxxxxxx");
    console.log(err);
  });

app.use(userRoutes);
app.use(ticketRoutes);

app.listen(3000);
