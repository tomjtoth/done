import type { Metadata } from "next";

import { getUsers, createEvent } from "@/lib/actions";

export const metadata: Metadata = {
  title: "New Event",
};

export default async function Events() {
  const users = await getUsers();

  return (
    <>
      <h3 className="text-center">Create new event</h3>

      <form className="flex flex-col items-center *:border *:rounded *:p-2 p-2 gap-2 [&_label]:pr-2">
        <div>
          <label htmlFor="user_id">user_id:</label>
          <select name="user_id">
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

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
