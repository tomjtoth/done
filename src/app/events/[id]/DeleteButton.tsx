"use client";

import { deleteEvent } from "@/lib/actions";

export default function DeleteButton({ eventId }: { eventId: number }) {
  return (
    <button
      className="cursor-pointer border rounded px-2 py-1"
      onClick={() => deleteEvent(eventId)}
    >
      Delete
    </button>
  );
}
