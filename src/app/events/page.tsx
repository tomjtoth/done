import Link from "next/link";

import { getEvents } from "@/lib/actions";

export default async function Events() {
  const events = await getEvents();
  return (
    <>
      <ul className="*:m-1 *:p-1">
        {events.map((ev) => (
          <li key={ev.id}>
            <Link className="border rounded p-1" href={`/events/${ev.id}`}>
              {ev.name}
            </Link>{" "}
            (<span className="text-sm">created by {ev.owner}</span>)
          </li>
        ))}
      </ul>
      <Link className="border rounded p-1" href="/events/new">
        Create new event
      </Link>
    </>
  );
}
