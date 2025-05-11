"use server";

import { redirect } from "next/navigation";
import SQL from "sql-template-strings";

import { getDb } from "@/lib/db";
import { getSession, getToken } from "@/lib/utils";

import { A01_2021, A02_2021, A03_2021, A09_2021 } from "../vulnerabilities";

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
  let userId = Number(data.get("user_id"));

  if (!A01_2021) {
    const sess = await getSession();
    if (!sess) {
      if (!A09_2021)
        console.log(
          "A09_2021 - tried creating an Event without a user session"
        );

      return redirect("/login");
    }

    userId = A02_2021 ? sess.id! : getToken(sess).id!;
  }

  const db = await getDb();

  let sql;

  if (A03_2021) {
    sql = `insert into events (user_id, name, description)
      values (${userId}, '${name}', '${description}');`;

    await db.exec(sql);
  } else {
    // using SQL will sanitize and quote the user input FIXING this ISSUE
    sql = SQL`insert into events (user_id, name, description)
      values (${userId}, ${name}, ${description});`;

    await db.run(sql);
  }

  if (!A09_2021)
    console.log("A09_2021 - new event created:", {
      userId,
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
  const db = await getDb();

  if (!A01_2021) {
    const sess = await getSession();
    if (!sess) {
      if (!A09_2021)
        console.log("tried deleting event: ", id, "without an active session");

      return redirect("/login");
    }

    const extractFromEvent = await db.get<Pick<Ev, "user_id">>(
      SQL`select user_id from events where id = ${id}`
    );

    if (!extractFromEvent) {
      if (!A09_2021) console.log("tried deleting non existent event: ", id);
      return;
    }

    const ownerId = extractFromEvent.user_id;
    const sessId = A02_2021 ? sess.id! : getToken(sess).id!;

    if (ownerId !== sessId) {
      if (!A09_2021)
        console.log(`user "${sessId}" tried to delete user's ${ownerId} event`);

      return;
    }
  }

  await db.run(SQL`delete from events where id = ${id}`);

  if (!A09_2021) console.log("deleted event:", id);

  redirect("/events");
}
