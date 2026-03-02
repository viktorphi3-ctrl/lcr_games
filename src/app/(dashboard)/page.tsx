export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import {
  formatCurrency,
  getConditionClass,
  getTimeAgo,
  getPlatformAbbr,
} from "@/lib/utils";
import {
  Layers,
  DollarSign,
  Gamepad2,
  Monitor,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Item } from "@/types";

async function getDashboardData() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !items) return null;

  const totalItems = items.length;
  const totalInvested = items.reduce(
    (sum: number, i: Item) => sum + (i.purchase_price || 0),
    0
  );
  const totalConsoles = items.filter((i: Item) => i.type === "console").length;
  const totalGames = items.filter((i: Item) => i.type === "game").length;
  const recentItems = items.slice(0, 4);

  const platformMap: Record<string, number> = {};
  items.forEach((i: Item) => {
    platformMap[i.platform] = (platformMap[i.platform] || 0) + 1;
  });
  const platformBreakdown = Object.entries(platformMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([platform, count]) => ({ platform, count }));

  return {
    totalItems,
    totalInvested,
    totalConsoles,
    totalGames,
    recentItems,
    platformBreakdown,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="p-6 md:p-8 text-center py-20 text-[#666666]">
        Erro ao carregar dados.
      </div>
    );
  }

  const {
    totalItems,
    totalInvested,
    totalConsoles,
    totalGames,
    recentItems,
    platformBreakdown,
  } = data;
  const maxCount = platformBreakdown[0]?.count || 1;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#e0e0e0]">
          Bem-vindo de volta! 👾
        </h1>
        <p className="text-[#555555] text-sm mt-1">
          Aqui está o resumo da sua coleção LCR GAMERS.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 md:p-5 card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555555] uppercase tracking-wider">
              Total Itens
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#00e6e6]/10 flex items-center justify-center">
              <Layers size={15} className="text-[#00e6e6]" />
            </div>
          </div>
          <p
            className="text-3xl font-bold text-[#e0e0e0]"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            {totalItems}
          </p>
          <p className="text-xs text-[#555555] mt-1">na coleção</p>
        </div>

        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 md:p-5 card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555555] uppercase tracking-wider">
              Investido
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#ff1a75]/10 flex items-center justify-center">
              <DollarSign size={15} className="text-[#ff1a75]" />
            </div>
          </div>
          <p
            className="text-lg md:text-xl font-bold text-[#ff1a75] leading-tight"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            {formatCurrency(totalInvested)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={11} className="text-[#00e6e6]" />
            <p className="text-xs text-[#555555]">valor total</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 md:p-5 card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555555] uppercase tracking-wider">
              Consoles
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#00e6e6]/10 flex items-center justify-center">
              <Monitor size={15} className="text-[#00e6e6]" />
            </div>
          </div>
          <p
            className="text-3xl font-bold text-[#e0e0e0]"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            {totalConsoles}
          </p>
          <p className="text-xs text-[#555555] mt-1">unidades</p>
        </div>

        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 md:p-5 card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#555555] uppercase tracking-wider">
              Jogos
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#ff1a75]/10 flex items-center justify-center">
              <Gamepad2 size={15} className="text-[#ff1a75]" />
            </div>
          </div>
          <p
            className="text-3xl font-bold text-[#e0e0e0]"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            {totalGames}
          </p>
          <p className="text-xs text-[#555555] mt-1">títulos</p>
        </div>
      </div>

      {/* Recent Additions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#e0e0e0]">
            Adicionados Recentemente
          </h2>
          <Link
            href="/collection"
            className="flex items-center gap-1 text-xs text-[#00e6e6] hover:text-[#00b3b3] transition-colors"
          >
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-10 text-center">
            <Gamepad2 size={36} className="text-[#2a2a2a] mx-auto mb-3" />
            <p className="text-[#555555] text-sm">Nenhum item ainda.</p>
            <Link
              href="/add"
              className="inline-block mt-3 text-[#00e6e6] text-sm hover:underline"
            >
              Adicionar primeiro item →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentItems.map((item: Item) => (
              <Link
                key={item.id}
                href={`/collection/${item.id}`}
                className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden transition-all hover:border-[#00e6e6]/30 hover:shadow-[0_0_20px_rgba(0,230,230,0.08)] group"
              >
                <div className="relative aspect-square bg-[#0a0a0a]">
                  {item.image_urls?.[0] ? (
                    <Image
                      src={item.image_urls[0]}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Gamepad2 size={28} className="text-[#2a2a2a]" />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded ${getConditionClass(item.condition)}`}
                  >
                    {item.condition}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[#e0e0e0] text-xs font-medium leading-tight line-clamp-2 mb-1">
                    {item.title}
                  </p>
                  <p className="text-[#555555] text-[11px] mb-2">
                    {item.platform}
                  </p>
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[#00e6e6] text-xs font-bold"
                      style={{ fontFamily: "'Orbitron', monospace" }}
                    >
                      {formatCurrency(item.purchase_price)}
                    </p>
                    <p className="text-[#3a3a3a] text-[10px]">
                      {getTimeAgo(item.created_at)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Platform Breakdown */}
      {platformBreakdown.length > 0 && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
          <h2 className="text-base font-semibold text-[#e0e0e0] mb-4">
            Breakdown por Plataforma
          </h2>
          <div className="space-y-3">
            {platformBreakdown.map(({ platform, count }, index) => {
              const pct = Math.round((count / maxCount) * 100);
              const colors = [
                "#00e6e6",
                "#ff1a75",
                "#7850ff",
                "#ffc800",
                "#00cc66",
              ];
              const color = colors[index % colors.length];
              return (
                <div key={platform} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center"
                        style={{
                          background: `${color}18`,
                          color,
                          fontFamily: "'Orbitron', monospace",
                        }}
                      >
                        {getPlatformAbbr(platform).charAt(0)}
                      </span>
                      <span className="text-sm text-[#e0e0e0]">{platform}</span>
                    </div>
                    <span className="text-xs text-[#555555]">
                      {count} {count === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: color,
                        boxShadow: `0 0 6px ${color}`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
