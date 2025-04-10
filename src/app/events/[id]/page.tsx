import { getEvents } from "@/lib/actions";

export default async function Events({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, events] = await Promise.all([params, getEvents()]);

  const ev = events.find((ev) => ev.id === Number(id))!;

  return (
    <>
      <h3>
        {ev.name}
        <sub>by {ev.owner}</sub>
      </h3>

      <h4>This event is about</h4>
      <p>{ev.description}</p>
    </>
  );
}
