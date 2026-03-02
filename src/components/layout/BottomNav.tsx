"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/collection", label: "Coleção", icon: Layers },
  { href: "/add", label: "Adicionar", icon: PlusCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-sm border-t border-[#1e1e1e]">
      <div className="flex items-center h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                isActive ? "text-[#00e6e6]" : "text-[#555555]"
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "transition-all",
                  isActive && "drop-shadow-[0_0_8px_#00e6e6]"
                )}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
