"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  formatCurrency,
  getConditionClass,
  getPlatformAbbr,
} from "@/lib/utils";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Gamepad2,
  Monitor,
  Trash2,
  Edit,
  X,
  Package,
  Printer,
  CheckSquare,
  Square,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Item, ItemType, ItemCondition } from "@/types";
import { useRouter } from "next/navigation";

const CONDITIONS: ItemCondition[] = ["CIB", "LOOSE", "MINT", "RELABEL"];

export default function CollectionPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ItemType | "all">("all");
  const [conditionFilter, setConditionFilter] = useState<ItemCondition | "all">("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [allPlatforms, setAllPlatforms] = useState<string[]>([]);

  // --- Selection mode ---
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const supabase = createClient();
  const router = useRouter();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (typeFilter !== "all") query = query.eq("type", typeFilter);
    if (conditionFilter !== "all") query = query.eq("condition", conditionFilter);
    if (platformFilter !== "all") query = query.eq("platform", platformFilter);
    if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

    const { data } = await query;
    setItems(data || []);
    setLoading(false);
  }, [supabase, typeFilter, conditionFilter, platformFilter, search]);

  useEffect(() => {
    supabase
      .from("items")
      .select("platform")
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((d) => d.platform))].sort();
          setAllPlatforms(unique);
        }
      });
  }, [supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleDelete(id: string) {
    if (!confirm("Deletar este item permanentemente?")) return;
    await supabase.from("items").delete().eq("id", id);
    fetchItems();
    setOpenMenu(null);
  }

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setConditionFilter("all");
    setPlatformFilter("all");
  }

  function toggleSelectionMode() {
    setSelectionMode((v) => !v);
    setSelectedIds(new Set());
    setOpenMenu(null);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }

  function openPrintReport() {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds).join(",");
    window.open(`/collection/print?ids=${ids}`, "_blank");
  }

  const hasFilters =
    search || typeFilter !== "all" || conditionFilter !== "all" || platformFilter !== "all";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#e0e0e0]">Minha Coleção</h1>
          <p className="text-[#555555] text-sm mt-0.5">
            {loading ? "Carregando..." : `${items.length} ${items.length === 1 ? "item" : "itens"} encontrados`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSelectionMode}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${selectionMode
                ? "border-[#ff1a75]/50 text-[#ff1a75] bg-[#ff1a75]/10"
                : "border-[#1e1e1e] text-[#888888] hover:text-[#e0e0e0] hover:border-[#333333]"
              }`}
          >
            <Printer size={15} />
            <span className="hidden sm:inline">{selectionMode ? "Cancelar" : "Selecionar"}</span>
          </button>
          {!selectionMode && (
            <Link
              href="/add"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #00e6e6, #ff1a75)",
                color: "#0a0a0a",
                boxShadow: "0 0 16px rgba(0,230,230,0.25)",
              }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Adicionar</span>
            </Link>
          )}
        </div>
      </div>

      {/* Selection mode hint */}
      {selectionMode && (
        <div className="bg-[#111111] border border-[#00e6e6]/20 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[#888888]">
            Clique nos itens para selecioná-los para o relatório.
          </p>
          <button
            onClick={selectAll}
            className="text-xs text-[#00e6e6] hover:underline whitespace-nowrap"
          >
            Selecionar todos
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 mb-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444444]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] text-[#e0e0e0] rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-[#3a3a3a] focus:outline-none focus:border-[#00e6e6] focus:shadow-[0_0_0_1px_#00e6e6] transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Type tabs */}
            <div className="flex bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-0.5">
              {(["all", "game", "console", "accessory"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-2.5 sm:py-1.5 min-h-[40px] sm:min-h-[0] rounded-md text-xs font-medium transition-all ${typeFilter === t
                    ? "bg-[#00e6e6]/10 text-[#00e6e6] border border-[#00e6e6]/30"
                    : "text-[#555555] hover:text-[#e0e0e0]"
                    }`}
                >
                  {t === "all" ? "Todos" : t === "game" ? "Jogos" : t === "console" ? "Consoles" : "Acessórios"}
                </button>
              ))}
            </div>

            {/* Condition */}
            <select
              value={conditionFilter}
              onChange={(e) =>
                setConditionFilter(e.target.value as ItemCondition | "all")
              }
              className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e0e0e0] rounded-lg px-3 py-2.5 sm:py-1.5 min-h-[40px] sm:min-h-[0] text-xs focus:outline-none focus:border-[#00e6e6] cursor-pointer"
            >
              <option value="all">Condição</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Platform */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-[#0a0a0a] border border-[#1e1e1e] text-[#e0e0e0] rounded-lg px-3 py-2.5 sm:py-1.5 min-h-[40px] sm:min-h-[0] text-xs focus:outline-none focus:border-[#00e6e6] cursor-pointer"
            >
              <option value="all">Plataforma</option>
              {allPlatforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2.5 sm:py-1.5 min-h-[40px] sm:min-h-[0] rounded-lg text-xs text-[#ff1a75] border border-[#ff1a75]/30 hover:bg-[#ff1a75]/10 transition-all"
              >
                <X size={12} /> Limpar
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 sm:p-1.5 min-h-[40px] sm:min-h-[0] rounded-md transition-all ${viewMode === "list"
                ? "bg-[#00e6e6]/10 text-[#00e6e6]"
                : "text-[#555555] hover:text-[#e0e0e0]"
                }`}
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 sm:p-1.5 min-h-[40px] sm:min-h-[0] rounded-md transition-all ${viewMode === "grid"
                ? "bg-[#00e6e6]/10 text-[#00e6e6]"
                : "text-[#555555] hover:text-[#e0e0e0]"
                }`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#00e6e6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-14 text-center">
          <Gamepad2 size={40} className="text-[#2a2a2a] mx-auto mb-3" />
          <p className="text-[#555555]">Nenhum item encontrado.</p>
          <Link
            href="/add"
            className="inline-block mt-3 text-[#00e6e6] text-sm hover:underline"
          >
            Adicionar item →
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return selectionMode ? (
              <button
                key={item.id}
                onClick={() => toggleSelect(item.id)}
                className={`bg-[#111111] border rounded-xl overflow-hidden transition-all text-left relative ${isSelected
                    ? "border-[#00e6e6] shadow-[0_0_16px_rgba(0,230,230,0.2)]"
                    : "border-[#1e1e1e] hover:border-[#00e6e6]/40"
                  }`}
              >
                <div className="relative aspect-square bg-[#0a0a0a]">
                  {item.image_urls?.[0] ? (
                    <Image src={item.image_urls[0]} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {item.type === "console" ? <Monitor size={24} className="text-[#2a2a2a]" /> : item.type === "accessory" ? <Package size={24} className="text-[#2a2a2a]" /> : <Gamepad2 size={24} className="text-[#2a2a2a]" />}
                    </div>
                  )}
                  <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${getConditionClass(item.condition)}`}>
                    {item.condition}
                  </span>
                  <div className={`absolute top-1.5 left-1.5 w-5 h-5 rounded flex items-center justify-center ${isSelected ? "text-[#00e6e6]" : "text-[#555555]"}`}>
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-[#e0e0e0] text-xs font-medium line-clamp-2 leading-tight">{item.title}</p>
                  <p className="text-[#555555] text-[10px] mt-0.5">{getPlatformAbbr(item.platform)}</p>
                  <p className="text-[#00e6e6] text-xs font-bold mt-1.5" style={{ fontFamily: "'Orbitron', monospace" }}>
                    {formatCurrency(item.purchase_price)}
                  </p>
                </div>
              </button>
            ) : (
              <Link
                key={item.id}
                href={`/collection/${item.id}`}
                className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden transition-all hover:border-[#00e6e6]/30 hover:shadow-[0_0_16px_rgba(0,230,230,0.08)] group"
              >
                <div className="relative aspect-square bg-[#0a0a0a]">
                  {item.image_urls?.[0] ? (
                    <Image src={item.image_urls[0]} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {item.type === "console" ? <Monitor size={24} className="text-[#2a2a2a]" /> : item.type === "accessory" ? <Package size={24} className="text-[#2a2a2a]" /> : <Gamepad2 size={24} className="text-[#2a2a2a]" />}
                    </div>
                  )}
                  <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${getConditionClass(item.condition)}`}>
                    {item.condition}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-[#e0e0e0] text-xs font-medium line-clamp-2 leading-tight">{item.title}</p>
                  <p className="text-[#555555] text-[10px] mt-0.5">{getPlatformAbbr(item.platform)}</p>
                  <p className="text-[#00e6e6] text-xs font-bold mt-1.5" style={{ fontFamily: "'Orbitron', monospace" }}>
                    {formatCurrency(item.purchase_price)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_44px] gap-4 px-4 py-3 border-b border-[#1e1e1e] text-xs text-[#555555] uppercase tracking-wider">
            <span>Item</span>
            <span>Plataforma</span>
            <span>Condição</span>
            <span>Ano</span>
            <span>Preço</span>
            <span />
          </div>

          <div className="divide-y divide-[#1a1a1a]">
            {items.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_44px] gap-3 md:gap-4 px-4 py-3.5 items-center transition-colors relative ${selectionMode
                      ? isSelected
                        ? "bg-[#00e6e6]/5 hover:bg-[#00e6e6]/8 cursor-pointer"
                        : "hover:bg-[#161616] cursor-pointer"
                      : "hover:bg-[#161616]"
                    }`}
                  onClick={() => {
                    if (selectionMode) {
                      toggleSelect(item.id);
                    } else if (openMenu === item.id) {
                      setOpenMenu(null);
                    }
                  }}
                >
                  {/* Checkbox / Item */}
                  <div className="flex items-center gap-3 min-w-0">
                    {selectionMode && (
                      <div className={`flex-shrink-0 ${isSelected ? "text-[#00e6e6]" : "text-[#444444]"}`}>
                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                      </div>
                    )}
                    {selectionMode ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg bg-[#0a0a0a] overflow-hidden flex-shrink-0 border border-[#1e1e1e]">
                          {item.image_urls?.[0] ? (
                            <Image src={item.image_urls[0]} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              {item.type === "console" ? <Monitor size={15} className="text-[#2a2a2a]" /> : item.type === "accessory" ? <Package size={15} className="text-[#2a2a2a]" /> : <Gamepad2 size={15} className="text-[#2a2a2a]" />}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#e0e0e0] text-sm font-medium truncate">{item.title}</p>
                          <p className="text-[#555555] text-xs md:hidden">{item.platform} · {item.condition}</p>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/collection/${item.id}`} className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg bg-[#0a0a0a] overflow-hidden flex-shrink-0 border border-[#1e1e1e]">
                          {item.image_urls?.[0] ? (
                            <Image src={item.image_urls[0]} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              {item.type === "console" ? <Monitor size={15} className="text-[#2a2a2a]" /> : item.type === "accessory" ? <Package size={15} className="text-[#2a2a2a]" /> : <Gamepad2 size={15} className="text-[#2a2a2a]" />}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#e0e0e0] text-sm font-medium truncate">{item.title}</p>
                          <p className="text-[#555555] text-xs md:hidden">{item.platform} · {item.condition}</p>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Platform */}
                  <div className="hidden md:block">
                    <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] px-2 py-1 rounded">
                      {getPlatformAbbr(item.platform)}
                    </span>
                  </div>

                  {/* Condition */}
                  <div className="hidden md:block">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getConditionClass(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>

                  {/* Year */}
                  <p className="hidden md:block text-sm text-[#888888]">
                    {item.release_year ?? "—"}
                  </p>

                  {/* Price */}
                  <p className="text-sm font-bold text-[#00e6e6] ml-auto md:ml-0" style={{ fontFamily: "'Orbitron', monospace" }}>
                    {formatCurrency(item.purchase_price)}
                  </p>

                  {/* Actions menu (only in normal mode) */}
                  {!selectionMode && (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenMenu(openMenu === item.id ? null : item.id);
                        }}
                        className="p-1.5 rounded-lg text-[#555555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === item.id && (
                        <div className="absolute right-0 top-8 z-50 bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-xl py-1 w-36">
                          <button
                            onClick={() => {
                              router.push(`/collection/${item.id}/edit`);
                              setOpenMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#e0e0e0] hover:bg-[#1e1e1e]"
                          >
                            <Edit size={14} className="text-[#00e6e6]" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#ff1a75] hover:bg-[#1e1e1e]"
                          >
                            <Trash2 size={14} />
                            Deletar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Print Toolbar */}
      {selectionMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border border-[#2a2a2a] backdrop-blur-md bg-[#161616]/95">
          <span className="text-sm text-[#888888] whitespace-nowrap">
            {selectedIds.size === 0
              ? "Nenhum item selecionado"
              : `${selectedIds.size} ${selectedIds.size === 1 ? "item" : "itens"} selecionado${selectedIds.size === 1 ? "" : "s"}`}
          </span>
          <div className="w-px h-5 bg-[#2a2a2a]" />
          <button
            onClick={openPrintReport}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={
              selectedIds.size > 0
                ? {
                  background: "linear-gradient(135deg, #00e6e6, #ff1a75)",
                  color: "#0a0a0a",
                  boxShadow: "0 0 16px rgba(0,230,230,0.3)",
                }
                : { background: "#1e1e1e", color: "#555" }
            }
          >
            <Printer size={15} />
            Imprimir Relatório
          </button>
          <button
            onClick={toggleSelectionMode}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-[#555555] hover:text-[#e0e0e0] hover:bg-[#2a2a2a] transition-all"
          >
            <X size={14} />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
