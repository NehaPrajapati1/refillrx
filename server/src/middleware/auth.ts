import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

// TEMPORARY: replaced by Google sign-in in Phase 6
export async function demoAuth(req: Request, res: Response, next: NextFunction) {
  const email = req.header("x-demo-user");
  if (!email) {
    res.status(401).json({ error: "Missing x-demo-user header" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "Unknown user" });
    return;
  }

  req.user = user;
  next();
}

export function requireStaff(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "staff") {
    res.status(403).json({ error: "Staff access only" });
    return;
  }
  next();
}