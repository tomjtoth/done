"use server";

import { redirect } from "next/navigation";
import SQL from "sql-template-strings";

import { getDb } from "@/lib/db";

export type Ev = {
  id?: number;
  user_id: number;
  name: string;
  description: string;
};

export async function createEvent(data: FormData) {
  const name = data.get("name");
  const description = data.get("description");
  const user_id = data.get("user_id");

  const db = await getDb();
  await db.run(SQL`insert into events (user_id, name, description)
    values (${Number(user_id)}, ${name}, ${description});`);

  redirect("/events");
}

export async function getEvents(): Promise<Ev[]> {
  const db = await getDb();
  return await db.all("select * from events");
}
