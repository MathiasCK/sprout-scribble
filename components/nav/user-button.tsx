"use client";

import { Session, User } from "next-auth";
import { signOut } from "next-auth/react";

const UserButton = ({ user, expires }: Session) => {
  return (
    <div>
      <h1>{user?.email}</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default UserButton;
