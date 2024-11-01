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
const addcart = require("./routes/cart/addcart");
const getcart = require("./routes/cart/getcart");
const removecart = require("./routes/cart/removecart");
const addaddress = require("./routes/cart/addaddress");
const removeaddress = require("./routes/cart/removeaddress");
const getaddress = require("./routes/cart/getaddress");
const updateaddress = require("./routes/cart/updateaddress");
const generateinvoice = require("./routes/bill/generateinvoice");
const getinvoice = require("./routes/bill/getinvoice");
const payment = require("./routes/bill/payment");
const trackorder = require("./routes/bill/trackorder");
const sendfile = require("./routes/bill/sendfile");
const postfile = require("./routes/bill/postfile");

const app = express();
const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  console.error("MongoDB URI is not defined in environment variables.");
  process.exit(1);
}
mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 100000,
});

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", signup);
app.use("/auth", login);
app.use("/item", getitems);
app.use("/item", additem);
app.use("/item", deleteitem);
app.use("/item", updateitem);
app.use("/cart", addcart);
app.use("/cart", getcart);
app.use("/cart", removecart);
app.use("/cart", addaddress);
app.use("/cart", removeaddress);
app.use("/cart", getaddress);
app.use("/cart", updateaddress);
app.use("/bill", generateinvoice);
app.use("/bill", getinvoice);
app.use("/bill", payment);
app.use("/bill", trackorder);
app.use("/bill", sendfile);
app.use("/bill", postfile);

app.listen(5050, () => {
  console.log(`Server is running on http://localhost:${5050}`);
});
