import jwt from "jsonwebtoken";
import type{ Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";

/**
 * Generate a short-lived access token (JWT)
 */
export const createAccessToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error("❌ JWT_SECRET not set in environment variables");
  }

  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN || "15m") as any;

  const options: SignOptions = {
    expiresIn, // cast ensures TS accepts string durations like "15m"
  };

  return jwt.sign({ id: userId }, secret, options);
};

/**
 * Generate a secure random refresh token (not JWT)
 */
export const createRefreshToken = (): string => {
  return crypto.randomBytes(40).toString("hex");
};

export const verifyAccessToken = (token: string): any => {
  const secret = process.env.JWT_SECRET as Secret;
  return jwt.verify(token, secret);
};
