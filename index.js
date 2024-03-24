const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();


app.use(cors());
app.use(express.json());



const connectToMongo = require("./utils/db");
connectToMongo();

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

let port = process.env.PORT;

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(port, () => console.log(`Server listening at port ${port}`));
