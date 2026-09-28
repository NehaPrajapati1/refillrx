import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { demoAuth } from "./middleware/auth";
import prescriptionsRouter from "./routes/prescription";
import refillsRouter from "./routes/refills";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Public route (no sign-in needed)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Everything below requires a user
app.use("/api", demoAuth);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/refills", refillsRouter);

// Catch unexpected errors so the server doesn't crash
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});