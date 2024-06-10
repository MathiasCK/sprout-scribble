import { auth } from "~/server/auth";
import { DashboardNav } from "~/components/nav";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div>
      <DashboardNav isAdmin={isAdmin} />
      {children}
    </div>
  );
};

export default DashboardLayout;
