import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./config";
import { SessUser } from "./actions";

export async function getSession(): Promise<SessUser | null> {
  const cookie = (await cookies()).get("session");
  return cookie ? JSON.parse(cookie.value) : null;
}

export function getToken(session: SessUser) {
  console.debug("using JWT_SECRET: ", JWT_SECRET);
  return jwt.verify(session.token!, JWT_SECRET) as SessUser;
}
