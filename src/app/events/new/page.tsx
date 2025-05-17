import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUsers, createEvent } from "@/lib/actions";
import { A01_2021 } from "@/lib/vulnerabilities";
import { getSession } from "@/lib/utils";

export const metadata: Metadata = {
  title: "New Event",
};

export default async function Events() {
  if (!A01_2021 && !(await getSession())) redirect("/login");

  return (
    <>
      <h3 className="text-center">Create new event</h3>

      <form className="flex flex-col items-center *:border *:rounded *:p-2 p-2 gap-2 [&_label]:pr-2 [&_input]:px-1">
        {A01_2021 && (
          <div>
            <label htmlFor="user_id">user_id:</label>
            <select name="user_id">
              {(await getUsers()).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="name">name:</label>
          <input type="text" name="name" />
        </div>

        <div>
          <label htmlFor="description">description:</label>
          <input type="text" name="description" />
        </div>

        <button className="cursor-pointer" formAction={createEvent}>
          Create
        </button>
      </form>
    </>
  );
}
