import express from "express";
import cors from "cors";

import { prisma } from "./lib/prisma";
import { getDaysRemaining, isRunningLow } from "./utils/supply";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/prescriptions", async (_req, res) => {
  const prescriptions = await prisma.prescription.findMany({
    orderBy: { id: "asc" },
  });

  const result = prescriptions.map((prescription) => ({
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