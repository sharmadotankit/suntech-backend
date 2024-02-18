const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URL;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connection success");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

module.exports = connectToMongo;
