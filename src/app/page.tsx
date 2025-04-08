import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/users">Users View</Link>
      </li>
    </ul>
  );
}
