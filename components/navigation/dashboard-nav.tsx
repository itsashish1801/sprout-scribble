"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export default function DashboardNav({
  allLinks,
}: {
  allLinks: { label: string; path: string; icon: JSX.Element }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="py-6 overflow-auto px-4 sm:px-6 lg:px-8">
      <ul className="flex gap-8 text-sm font-semibold">
        <AnimatePresence>
          {allLinks.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.label}>
              <Link
                className={cn(
                  "flex items-center gap-1.5 relative",
                  pathname === link.path ? "text-primary" : ""
                )}
                href={link.path}
              >
                {link.icon} {link.label}
                {pathname === link.path && (
                  <motion.div
                    className="h-0.5 w-full bg-primary rounded-full absolute left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 30,
                      duration: 0.1,
                    }}
                    layoutId="active-link"
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
