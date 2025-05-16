import Link from "next/link";

import { getEvents } from "@/lib/actions";

export default async function Events() {
  const events = await getEvents();
  return (
    <>
      <ul>
        {events.map((ev) => (
          <li key={ev.id}>
            <Link href={`/events/${ev.id}`}>{ev.name}</Link> ({ev.owner})
          </li>
        ))}
      </ul>
      <Link href="/events/new">Create new event</Link>
    </>
  );
}
