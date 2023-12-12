const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const path = require("path");
const serverless = require('serverless-http')
const mongoose = require('mongoose')
require("dotenv").config();



mongoose
  .connect(process.env.DBCONFIG, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {
      console.log('Database is successfully connected')
    },
    (err) => {
      console.log('cannont connect to the database' + err)
    }
  )


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

//routers
const vendor = require("./routes/vendor.route");
const user = require("./routes/user.route");
const business = require("./routes/business.route");
const category = require("./routes/category.route");
const product = require("./routes/product.route");
const order = require("./routes/order.route");

const notFoundMiddleware = require("./middleware/notFound.middleware");

const router = express.Router();

app.use("/.netlify/functions//api/v1/vendor", vendor);
app.use("/.netlify/functions//api/v1/user", user);
app.use("/.netlify/functions//api/v1/business", business);
app.use("/.netlify/functions//api/v1/category", category);
app.use("/.netlify/functions//api/v1/product", product);
app.use("/.netlify/functions//api/v1/order", order);
app.use("/", router.get("/", (req, res)=>{
  res.send('welocome to sl handycraft backend')
}));

app.use(notFoundMiddleware);

module.exports = app
module.exports.handler = serverless(app)

/*  const PORT = process.env.APPPORT || 9000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})  */
