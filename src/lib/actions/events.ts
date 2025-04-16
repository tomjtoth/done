"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SQL from "sql-template-strings";

import { getDb } from "@/lib/db";
import { A01_2021, A03_2021, A09_2021 } from "../vulnerabilities";

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
  const user_id = A01_2021
    ? Number(data.get("user_id"))
    : JSON.parse((await cookies()).get("session")!.value).id;

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

  if (!A09_2021)
    console.log("A09_2021 - new event created:", {
      user_id,
      name,
      description,
    });

  console.debug("A03_2021 - the following SQL was executed on the DB:\n", sql);
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

export async function deleteEvent(id: number) {
  if (!A01_2021 && !(await cookies()).get("session")) return redirect("/login");

  const db = await getDb();

  await db.run(SQL`
    delete from events
    where id = ${id}
  `);

  redirect("/events");
}
