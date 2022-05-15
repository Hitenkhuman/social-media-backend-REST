const express = require("express");
require("dotenv").config();
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//imports of router
const api = require("./routes/api");

//route middleware
app.use("/api", api);
module.exports = app;
