"use client";
import { SessionProvider } from "next-auth/react";
import Landing from "./components/Landing";

export default function Home({
  session
}: {
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <Landing />
    </SessionProvider>
  );
}