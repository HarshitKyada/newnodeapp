require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login");
const getitems = require("./routes/items/getitems");
const additem = require("./routes/items/additem");
const deleteitem = require("./routes/items/deleteitem");
const updateitem = require("./routes/items/updateitem");

const app = express();
const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  console.error("MongoDB URI is not defined in environment variables.");
  process.exit(1); // Exit if the URI is not defined
}
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 100000,
});

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", signup);
app.use("/auth", login);
app.use("/items", getitems);
app.use("/items", additem);
app.use("/items", deleteitem);
app.use("/items", updateitem);

app.listen(5050, () => {
  console.log(`Server is running on http://localhost:${5050}`);
});
