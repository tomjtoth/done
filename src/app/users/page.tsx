import { createUser, getUsers } from "@/app/actions";

export default async function Users() {
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

      <h3>Create new user</h3>
      <form className="flex flex-col items-center *:border *:p-2 p-2 gap-2 [&_label]:pr-2">
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
