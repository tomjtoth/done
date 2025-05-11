import { getUsers } from "@/lib/actions";

export default async function ListUsers() {
  const users = await getUsers();

  return (
    <>
      <h3>Existing users:</h3>
      <ul>
        {users.map((user, i) => (
          <li key={i}>
            {user.name} (email: {user.email})
          </li>
        ))}
      </ul>
    </>
  );
}
