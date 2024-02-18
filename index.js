const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());


const connectToMongo = require("./utils/db");
connectToMongo();

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

let port = process.env.PORT;

app.use("/api/auth", authRoute);
app.use("/", userRoute);

app.listen(port, () => console.log(`Server listening at port ${port}`));
