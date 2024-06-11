"use client";
import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

const Toaster = () => {
  const { theme } = useTheme();

  if (typeof theme !== "string") return null;

  return (
    <SonnerToaster richColors theme={theme as "light" | "dark" | "system"} />
  );
};

export default Toaster;
