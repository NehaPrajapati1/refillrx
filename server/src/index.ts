import express from "express";
import cors from "cors";
import { samplePrescriptions } from "./data/sampleData";
import { getDaysRemaining, isRunningLow } from "./utils/supply";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/prescriptions", (_req, res) => {
  const result = samplePrescriptions.map((prescription) => ({
    ...prescription,
    daysRemaining: getDaysRemaining(prescription),
    runningLow: isRunningLow(prescription),
  }));
  res.json(result);
});

app.get("/", (_req, res) => {
  res.send("RefillRx API is running. Try /api/health or /api/prescriptions");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});