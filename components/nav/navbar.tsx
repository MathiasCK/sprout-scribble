import { auth } from "~/server/auth";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Logo, UserButton } from "~/components/nav";
import { CartDrawer } from "~/components/cart";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
          <li className="flex flex-1">
            <Link href="/" aria-label="Company logo">
              <Logo />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
