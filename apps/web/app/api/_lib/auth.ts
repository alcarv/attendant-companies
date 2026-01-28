import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function getJwtSecret() {
  const jwtSecret = process.env.SESSION_SECRET;
  if (!jwtSecret) {
    throw new Error("SESSION_SECRET is required");
  }
  return jwtSecret;
}

export type AuthPayload = {
  userId: string;
  companyId: string;
  email: string;
};

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function getAuthPayload(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  const token = auth.replace("Bearer ", "");
  try {
    return jwt.verify(token, getJwtSecret()) as AuthPayload;
  } catch {
    return null;
  }
}

export function requireAuth(request: Request) {
  const auth = getAuthPayload(request);
  if (!auth) {
    return {
      auth: null,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 })
    };
  }

  return { auth, response: null };
}
