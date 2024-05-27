import { auth } from "~/server/auth";
import UserButton from "./user-button";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-slate-500 py-4">
      <nav>
        <ul className="flex justify-between">
          <li>Logo</li>
          {session?.user && session.expires && (
            <li>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
