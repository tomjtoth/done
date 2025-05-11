import { cookies } from "next/headers";

import { SessUser } from "./actions";

export async function getSession(): Promise<SessUser | null> {
  const cookie = (await cookies()).get("session");
  return cookie ? JSON.parse(cookie.value) : null;
}
