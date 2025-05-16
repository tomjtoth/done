"use client";

import { useRef } from "react";

import { createUser } from "@/lib/actions";

const PW_PARTS = [/[a-z]/, /[A-Z]/, /\d/];

export default function Register() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const verify = (form.elements.namedItem("verify") as HTMLInputElement)
      .value;

    const alerts: string[] = [];

    if (password !== verify) alerts.push("Passwords do not match!");

    if (PW_PARTS.map((re) => password.match(re)).some((x) => !x))
      alerts.push("PW must contain at least 1 from each range: A-Z, a-z, 0-9");

    if (alerts.length > 0) e.preventDefault();
    alerts.forEach((msg) => alert(msg));
  };

  return (
    <>
      <h3 className="text-center">Create new user</h3>
      <form
        ref={formRef}
        className="flex flex-col items-center *:border *:rounded *:p-2 p-2 gap-2 [&_label]:pr-2 [&_input]:px-1"
        onSubmit={handleSubmit}
        action={createUser}
        method="post"
      >
        <div>
          <label htmlFor="name">name:</label>
          <input type="text" name="name" id="name" minLength={3} />
        </div>

        <div>
          <label htmlFor="email">email:</label>
          <input
            type="text"
            name="email"
            id="email"
            pattern="\w+@\w{2,}\.\w{2,}"
          />
        </div>

        <div>
          <label htmlFor="password">password:</label>
          <input type="password" name="password" id="password" minLength={8} />
        </div>

        <div>
          <label htmlFor="verify">verify:</label>
          <input type="password" name="verify" id="verify" minLength={8} />
        </div>

        <button className="cursor-pointer" type="submit">
          Register
        </button>
      </form>
    </>
  );
}
