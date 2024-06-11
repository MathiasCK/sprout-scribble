"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChartIcon,
  PackageIcon,
  PenSquareIcon,
  SettingsIcon,
  TruckIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

const DashboardNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname();

  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <TruckIcon size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <SettingsIcon size={16} />,
    },
  ] as const;

  const adminLinks = isAdmin
    ? ([
        {
          label: "Analytics",
          path: "/dashboard/analytics",
          icon: <BarChartIcon size={16} />,
        },
        {
          label: "Create",
          path: "/dashboard/product",
          icon: <PenSquareIcon size={16} />,
        },
        {
          label: "Products",
          path: "/dashboard/products",
          icon: <PackageIcon size={16} />,
        },
      ] as const)
    : [];

  const allLinks = [...userLinks, ...adminLinks];

  return (
    <nav className="py-2 overflow-auto mb-4">
      <ul className="flex gap-6 text-xs font-semibold">
        <AnimatePresence>
          {allLinks.map(link => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
              <Link
                className={cn("flex gap-1 flex-col items-center relative", {
                  "text-primary": pathname === link.path,
                })}
                href={link.path}
              >
                {link.icon}
                {link.label}
                {pathname === link.path ? (
                  <motion.div
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
};

export default DashboardNav;
