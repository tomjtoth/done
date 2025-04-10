import type { Metadata } from "next";

import { loginUser } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Login",
};

export default function Users() {
  return (
    <form className="flex flex-col items-center *:border *:p-2 p-2 gap-2 [&_label]:pr-2">
      <div>
        <label htmlFor="email">email:</label>
        <input type="text" name="email" />
      </div>

      <div>
        <label htmlFor="password">password:</label>
        <input type="text" name="password" />
      </div>

      <button className="cursor-pointer" formAction={loginUser}>
        Login
      </button>
    </form>
  );
}
