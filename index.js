const app = require("./app");
const connectWithDb = require("./config/db");
require("dotenv").config();

//databse connection
connectWithDb();

app.listen(process.env.PORT, () => {
  console.log("Server is running on " + process.env.PORT);
});
