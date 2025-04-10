"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import SQL from "sql-template-strings";

import { getDb } from "@/lib/db";

type User = { id?: number; name: string; email: string; password: string };

export async function createUser(data: FormData) {
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  const db = await getDb();
  await db.run(SQL`insert into users (name, email, password)
    values (${name}, ${email}, ${password});`);

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
    where email = ${email} 
    and password = ${password}`
  );

  if (userRow) {
    const cStore = await cookies();
    cStore.set("session", JSON.stringify(userRow), { path: "/" });
    redirect("/events");
  }
}

export async function logoutUser() {
  const cStore = await cookies();
  cStore.delete("session");
  redirect("/");
}
