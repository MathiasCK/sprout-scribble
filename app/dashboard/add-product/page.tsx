import { NextPage } from "next";
import { redirect } from "next/navigation";
import { AddProductCard } from "~/components/dashboard";
import { auth } from "~/server/auth";

const AddProductPage: NextPage = async () => {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return redirect("/dashboard/settings");
  }

  return <AddProductCard />;
};

export default AddProductPage;
