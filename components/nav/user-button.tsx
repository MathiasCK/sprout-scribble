"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { FC } from "react";

interface Props {
  user: User;
  expires: string;
}

const UserButton: FC<Props> = ({ user, expires }) => {
  return (
    <div>
      <h1>{user.email}</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default UserButton;
