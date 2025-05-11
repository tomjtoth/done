import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { logoutUser } from "@/lib/actions";
import { getSession } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Events",
  description: "An activity tracker",
};

type View = { href: string; label: string };

const baseViews = [
  { href: "/", label: "home" },
  { href: "/users", label: "users" },
  { href: "/events", label: "events" },
];

const anonymous = [
  { href: "/login", label: "login" },
  { href: "/register", label: "register" },
];

const listItems = (arr: View[]) =>
  arr.map((v) => (
    <li key={v.href}>
      <Link href={v.href}>{v.label}</Link>
    </li>
  ));

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav>
          <ul className="flex gap-2 bg-amber-300 *:select-none">
            {listItems(baseViews)}
            {session ? (
              <button className="cursor-pointer" onClick={logoutUser}>
                logout ({session.name})
              </button>
            ) : (
              listItems(anonymous)
            )}
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
