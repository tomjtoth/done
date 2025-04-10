import type { Metadata } from "next";

import { createUser } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Register",
};

export default function Users() {
  return (
    <>
      <h3 className="text-center">Create new user</h3>

      <form className="flex flex-col items-center *:border *:rounded *:p-2 p-2 gap-2 [&_label]:pr-2">
        <div>
          <label htmlFor="name">name:</label>
          <input type="text" name="name" />
        </div>

        <div>
          <label htmlFor="email">email:</label>
          <input type="text" name="email" />
        </div>

        <div>
          <label htmlFor="password">password:</label>
          <input type="text" name="password" />
        </div>
        <button className="cursor-pointer" formAction={createUser}>
          Register
        </button>
      </form>
    </>
  );
}
