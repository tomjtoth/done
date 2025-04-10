"use server";

import { redirect } from "next/navigation";
import SQL from "sql-template-strings";

import { getDb } from "@/lib/db";
import { A03_2021 } from "../vulnerabilities";

type Ev = {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  owner?: string;
};

export async function createEvent(data: FormData) {
  const name = data.get("name");
  const description = data.get("description");
  const user_id = Number(data.get("user_id"));

  const db = await getDb();

  let sql;

  if (A03_2021) {
    sql = `insert into events (user_id, name, description)
      values (${user_id}, '${name}', '${description}');`;

    await db.exec(sql);
  } else {
    // using SQL will sanitize and quote the user input FIXING this ISSUE
    sql = SQL`insert into events (user_id, name, description)
      values (${user_id}, ${name}, ${description});`;

    await db.run(sql);
  }

  console.debug("the following SQL was executed on the DB:", sql);
  redirect("/events");
}

export async function getEvents(): Promise<Ev[]> {
  const db = await getDb();

  return await db.all(`
    select e.*, u.name as owner
    from events e
    inner join users u
    on e.user_id == u.id
  `);
}
