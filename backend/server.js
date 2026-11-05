import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ success: true, data: { status: "ok" } }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", rateLimit({ windowMs: 60 * 1000, max: 20 }), chatRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: { code: "SERVER", message: "Erreur serveur" } });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connecté");
  app.listen(process.env.PORT, () => console.log("API sur le port " + process.env.PORT));
});