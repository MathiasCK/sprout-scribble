import { NextPage } from "next";
import { redirect } from "next/navigation";
import { SettingsCard } from "~/components/dashboard";
import { auth } from "~/server/auth";

const SettingsPage: NextPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <SettingsCard session={session} />;
};

export default SettingsPage;
