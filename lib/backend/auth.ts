import { NextRequest } from "next/server";
import crypto from "crypto";

import { AppError } from "@/lib/backend/errors";
import { db } from "@/lib/backend/store";
import { User } from "@/lib/backend/types";

const AUTH_HEADER = "x-gdc-auth";

function computeSignature(userId: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(userId).digest("hex");
}

export function requireUser(request: NextRequest): User {
  const token = request.headers.get(AUTH_HEADER);
  if (!token) {
    throw new AppError("Missing x-gdc-auth header", 401);
  }
  const [userId, providedSignature] = token.split(".");
  const secret = process.env.GDC_API_AUTH_SECRET;
  if (!userId || !providedSignature || !secret) {
    throw new AppError("Invalid auth token", 401);
  }
  const expectedSignature = computeSignature(userId, secret);
  if (providedSignature.length !== expectedSignature.length) {
    throw new AppError("Invalid auth token", 401);
  }
  const signaturesMatch = crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature));
  if (!signaturesMatch) {
    throw new AppError("Invalid auth token", 401);
  }

  const user = db.getUserById(userId);
  if (!user) {
    throw new AppError("Unknown user", 401);
  }
  return user;
}

export function requireAdmin(user: User): void {
  if (user.role !== "admin") {
    throw new AppError("Admin role is required", 403);
  }
}

