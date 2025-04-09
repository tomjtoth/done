import { getUsers } from "@/app/actions/users";

export default async function ListUsers() {
  const users = await getUsers();
  return (
    <>
      <h3>Existing users:</h3>
      <ul>
        {users.map((user, i) => (
          <li key={i}>
            {user.name} ({user.email}:{user.password})
          </li>
        ))}
      </ul>
    </>
  );
}
