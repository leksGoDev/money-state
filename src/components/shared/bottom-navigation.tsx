"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/obligations", label: "Obligations" },
  { href: "/settings", label: "Settings" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-[calc(0.8rem+env(safe-area-inset-bottom))] left-1/2 z-50 w-[min(30rem,calc(100%-1rem))] -translate-x-1/2 rounded-[1.55rem] border border-line bg-[#f4ebdc]/95 p-2 shadow-card backdrop-blur">
      <ul className="grid grid-cols-4 gap-1.5">
        {navigationItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-[1rem] px-2 py-2 text-center text-[0.7rem] font-medium",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
