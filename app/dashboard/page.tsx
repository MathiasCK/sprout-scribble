import { NextPage } from "next";
import { redirect } from "next/navigation";

const DashboardPage: NextPage = () => {
  redirect("/dashboard/settings");
};

export default DashboardPage;
