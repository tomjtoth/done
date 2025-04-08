"use server";

import { revalidatePath } from "next/cache";

type User = { name: string; email: string; password: string };

const USERS: User[] = [];

export async function createUser(data: FormData) {
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  USERS.push({ name, email, password });
  console.debug(USERS);
  revalidatePath("/users");
}

export async function getUsers(): Promise<User[]> {
  return await USERS;
}
