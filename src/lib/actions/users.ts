"use server";

import { readFileSync } from "fs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import SQL from "sql-template-strings";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

import { getDb } from "@/lib/db";
import { JWT_SECRET } from "@/lib/config";
import { A02_2021, A07_2021, A09_2021 } from "../vulnerabilities";

type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
};

export type SessUser = Omit<User, "password"> & {
  token?: string;
};

/**
 * https://github.com/OWASP/passfault/blob/master/wordlists/wordlists/10k-worst-passwords.txt
 */
const TOP10k_PW_LIST = readFileSync("./10k-worst-passwords.txt", {
  encoding: "utf-8",
}).split("\n");

export async function createUser(data: FormData) {
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (!A07_2021) {
    if (name === password || email === password) {
      if (!A09_2021)
        console.log("new user's password matches their email or username");
      return;
    }

    if (TOP10k_PW_LIST.includes(password)) {
      if (!A09_2021) console.log("new user's password is present in top10k");
      return;
    }
  }

  const pwHash = hashSync(password, 10);

  const db = await getDb();
  await db.run(SQL`insert into users (name, email, password)
    values (${name}, ${email}, ${pwHash});`);

  if (!A09_2021) console.log("new user registered:", { name, email });

  redirect("/login");
}

export async function getUsers(): Promise<User[]> {
  const db = await getDb();
  return await db.all("select * from users");
}

export async function loginUser(data: FormData) {
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  const db = await getDb();
  const userRow = await db.get<User>(
    SQL`select * from users
    where email = ${email}`
  );

  if (!userRow) {
    if (!A09_2021) {
      console.log("failed login attempt (non-existent user):", email);
    }

    return;
  }

  if (!compareSync(password, userRow.password)) {
    if (!A09_2021) console.log("failed login attempt (wrong password):", email);

    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeToSend } = userRow;

  if (!A02_2021)
    (safeToSend as SessUser).token = jwt.sign(safeToSend, JWT_SECRET);
  const session = JSON.stringify(safeToSend);

  const cStore = await cookies();
  cStore.set("session", session, { path: "/" });

  if (!A09_2021) console.log("user successfully logged in:", email);

  redirect("/events");
}

export async function logoutUser() {
  const cStore = await cookies();

  if (!A09_2021) console.log("ending session:", cStore.get("session")!.value);

  cStore.delete("session");
  redirect("/");
}
