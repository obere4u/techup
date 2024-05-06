const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const talentsRouter = require("./routes/talents");
// const paymentRouter = require("./routes/payment");
const donorRouter = require("./routes/donors");
const partnerRouter = require("./routes/partners");
const authRouter = require("./routes/auth");
const resourceRouter = require("./routes/resource");
const adminRouter = require("./routes/admin");

const port = process.env.PORT || 4000;
const mongodb_connection_string = process.env.MONGODB_CONNECTION_STRING;

//middleware
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// APIs
app.use("/talents", talentsRouter); //talents API
app.use("/donors", donorRouter); // Donors API
app.use("/partners", partnerRouter); // Donors API
app.use("/auth", authRouter); // auth API
app.use("/resources", resourceRouter); // resource API 
app.use("/admin", adminRouter); // resource API 

//error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";

  res.status(statusCode).json({ success: false, statusCode, message });
});

app.get("/", (req, res) => {
  res.send("Welcome to TechUp");
});

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});

mongoose
  .connect(mongodb_connection_string)
  .then(() => {
    console.log("MongoDb connected successfully");
  })
  .catch((error) => {
    console.log("MongoDb connection failed: ", error.message);
  });
