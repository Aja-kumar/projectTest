import express, { json } from "express";
import dotenv from "dotenv";
import CookieParser from "cookie-parser";
import { connectDB } from "./utills/connectDb.js";
import AuthRouter from "./routes/authRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const Port = process.env.PORT || 4001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(CookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", AuthRouter);

app.listen(Port, () => {
  console.log(`server is running on localhost : ${Port}`);
  connectDB();
});
