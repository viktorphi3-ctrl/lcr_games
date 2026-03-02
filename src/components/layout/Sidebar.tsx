"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Layers, PlusCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/collection", label: "Coleção", icon: Layers },
  { href: "/add", label: "Adicionar", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#0d0d0d] border-r border-[#1e1e1e] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1e1e1e]">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src="/logo.webp"
            alt="LCR GAMERS"
            fill
            className="object-contain drop-shadow-[0_0_10px_rgba(0,230,230,0.4)]"
            priority
          />
        </div>
        <div>
          <p
            className="font-bold text-sm text-[#00e6e6] tracking-wider leading-tight"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            LCR GAMERS
          </p>
          <p className="text-xs text-[#666666]">Collection Vault</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[#00e6e6]/10 text-[#00e6e6] border border-[#00e6e6]/30 shadow-[0_0_15px_rgba(0,230,230,0.1)]"
                  : "text-[#666666] hover:text-[#e0e0e0] hover:bg-[#1a1a1a]"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "transition-all flex-shrink-0",
                  isActive
                    ? "text-[#00e6e6] drop-shadow-[0_0_6px_#00e6e6]"
                    : "group-hover:text-[#e0e0e0]"
                )}
              />
              <span className="text-sm font-medium">{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00e6e6] shadow-[0_0_6px_#00e6e6]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 border-t border-[#1e1e1e] pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[#666666] hover:text-[#ff1a75] hover:bg-[#ff1a75]/10 transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
