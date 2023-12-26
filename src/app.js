require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const path = require("path");
const serverless = require("serverless-http");

var corsOptions = {
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const router = express.Router();

mongoose
  .connect(
    process.env.MONGODB_URI || ""
  )
  .then(
    () => {
      console.log("Database is successfully connected");
    },
    (err) => {
      console.log("can not connect to the database" + err);
    }
  );

app.options("*", cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.urlencoded());
app.use(express.json());
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "public")));

require("./routes/business.routes")(router);
require("./routes/category.routes")(router);
require("./routes/order.routes")(router);
require("./routes/product.routes")(router);
require("./routes/user.routes")(router);
require("./routes/vendor.routes")(router);

app.use("/.netlify/functions/", router);

app.use(require("./middleware/notFound.middleware"));

// for local environment comment this part
module.exports = app;
// for local environment comment this part
module.exports.handler = serverless(app);

// for local environment uncomment below part

// const PORT = process.env.APPPORT || 9000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
