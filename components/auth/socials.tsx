"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

const Social = () => {
  return (
    <div>
      <Button
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Sign in with Google
      </Button>
      <Button
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default Social;
