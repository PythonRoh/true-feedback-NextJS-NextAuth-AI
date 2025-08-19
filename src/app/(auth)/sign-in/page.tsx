// why use client here ?
// because this component uses next-auth which is a client-side library
// and it needs to be rendered on the client side
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className="bg-orange-500 m-4 rounded py-2 px-2"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
