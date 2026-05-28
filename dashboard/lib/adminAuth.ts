import { NextRequest } from "next/server";

export function getAdminTokenFromRequest(req: NextRequest) {
  const header = req.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  const cookieToken = req.cookies.get("admin_token")?.value;
  return cookieToken ?? null;
}

export function assertAdmin(req: NextRequest) {
  const expected = process.env.ACCESS_TOKEN;
  if (!expected) throw new Error("Missing ACCESS_TOKEN");
  const provided = getAdminTokenFromRequest(req);
  if (!provided || provided !== expected) {
    return false;
  }
  return true;
}

