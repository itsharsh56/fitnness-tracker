import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true})); // for form data

app.use("/api/user/", UserRoutes);
// error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

app.get("/", async(req, res) => {
    res.status(200).json({
        message: "Welcome to the server!",
    });
});

const connectDb = () => {
    mongoose.set("strictQuery", true);
    mongoose
        .connect(process.env.MONGO_URI)
        .then((res) => console.log("MongoDB connected"))
        .catch((err) => {
            console.error("Failed to connect to MongoDB");
            console.log(err);
        });
};

const startServer = async () => {
    connectDb();
    try {
        app.listen(5000, () => console.log("Server started on port 5000"));
    } catch(err){
        console.log(err);
    }
};

startServer();