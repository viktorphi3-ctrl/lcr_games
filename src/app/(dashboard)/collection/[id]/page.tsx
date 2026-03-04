export const dynamic = "force-dynamic";
export const runtime = "edge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, getConditionClass } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Edit,
  Gamepad2,
  Monitor,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Factory,
  Globe,
  TrendingUp,
} from "lucide-react";
import type { Item } from "@/types";
import { DeleteItemButton } from "@/components/collection/DeleteItemButton";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const { data: related } = await supabase
    .from("items")
    .select("*")
    .eq("platform", item.platform)
    .neq("id", id)
    .limit(4);

  const images: string[] = item.image_urls || [];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-[#555555]">
        <Link
          href="/collection"
          className="flex items-center gap-1 hover:text-[#00e6e6] transition-colors"
        >
          <ChevronLeft size={16} />
          Coleção
        </Link>
        <span>/</span>
        <span className="text-[#e0e0e0] truncate max-w-[200px]">
          {item.title}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-[#111111] rounded-2xl overflow-hidden border border-[#1e1e1e]">
            {images[0] ? (
              <Image
                src={images[0]}
                alt={item.title}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                {item.type === "console" ? (
                  <Monitor size={64} className="text-[#2a2a2a]" />
                ) : (
                  <Gamepad2 size={64} className="text-[#2a2a2a]" />
                )}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2">
            {images.map((url, i) => (
              <div
                key={i}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-[#111111] cursor-pointer transition-all ${i === 0
                  ? "border-[#00e6e6] shadow-[0_0_10px_rgba(0,230,230,0.2)]"
                  : "border-[#1e1e1e] hover:border-[#00e6e6]/50"
                  }`}
              >
                <Image
                  src={url}
                  alt={`${item.title} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {Array.from({ length: Math.max(0, 3 - images.length) }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-20 h-20 rounded-xl border border-dashed border-[#222222] bg-[#0a0a0a] flex items-center justify-center"
                >
                  <span className="text-[#2a2a2a] text-lg font-light">+</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-[#e0e0e0] leading-tight">
                {item.title}
              </h1>
              <span
                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg ${getConditionClass(item.condition)}`}
              >
                {item.condition}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#555555]">
              <span className="flex items-center gap-1">
                <Tag size={13} />
                {item.platform}
              </span>
              {item.release_year && (
                <>
                  <span className="text-[#2a2a2a]">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {item.release_year}
                  </span>
                </>
              )}
              <span className="text-[#2a2a2a]">·</span>
              <span className="capitalize flex items-center gap-1">
                {item.type === "console" ? (
                  <Monitor size={13} />
                ) : item.type === "accessory" ? (
                  <Package size={13} />
                ) : (
                  <Gamepad2 size={13} />
                )}
                {item.type === "console" ? "Console" : item.type === "accessory" ? "Acessório" : "Jogo"}
              </span>
              {item.box_condition && (
                <>
                  <span className="text-[#2a2a2a]">·</span>
                  <span className="flex items-center gap-1 text-[#aaaaaa]">
                    <Package size={13} />
                    {item.box_condition}
                  </span>
                </>
              )}
            </div>

            {(item.developer || item.units_sold) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#666666] mt-3">
                {item.developer && (
                  <span className="flex items-center gap-1 bg-[#1a1a1a] px-2 py-1 rounded-md border border-[#222]">
                    <Factory size={12} className="text-[#888]" />
                    {item.developer}
                  </span>
                )}
                {item.units_sold && (
                  <span className="flex items-center gap-1 bg-[#1a1a1a] px-2 py-1 rounded-md border border-[#222]">
                    <Globe size={12} className="text-[#888]" />
                    {Number(item.units_sold).toLocaleString('pt-BR')} unidades vendidas globais
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={14} className="text-[#00e6e6]" />
                <span className="text-xs text-[#555555] uppercase tracking-wider">
                  Preço Pago
                </span>
              </div>
              <p
                className="text-2xl font-bold text-[#00e6e6]"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                {formatCurrency(item.purchase_price)}
              </p>
            </div>

            {item.market_value !== null && item.market_value !== undefined && (
              <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className={item.purchase_price < item.market_value ? "text-[#00e676]" : "text-[#ff1a75]"} />
                  <span className="text-xs text-[#555555] uppercase tracking-wider">
                    Mercado
                  </span>
                </div>
                <p
                  className="text-2xl font-bold text-[#e0e0e0]"
                  style={{ fontFamily: "'Orbitron', monospace" }}
                >
                  {formatCurrency(item.market_value)}
                </p>
                {item.purchase_price < item.market_value && (
                  <div className="absolute top-0 right-0 bg-[#00e676]/20 text-[#00e676] text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    Bom Negócio
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Included Items */}
          {item.type === "console" && item.included_items && (
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4">
              <p className="text-xs flex items-center gap-1 text-[#555555] uppercase tracking-wider mb-2">
                <Package size={13} className="text-[#00e6e6]" />
                Itens Inclusos
              </p>
              <p className="text-sm text-[#e0e0e0] leading-relaxed">
                {item.included_items}
              </p>
            </div>
          )}

          {/* Notes */}
          {item.description && (
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4">
              <p className="text-xs text-[#555555] uppercase tracking-wider mb-2">
                Notas
              </p>
              <p className="text-sm text-[#e0e0e0] leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href={`/collection/${item.id}/edit`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border border-[#00e6e6]/40 text-[#00e6e6] hover:bg-[#00e6e6]/10 hover:shadow-[0_0_15px_rgba(0,230,230,0.1)]"
            >
              <Edit size={16} />
              Editar Item
            </Link>
            <DeleteItemButton itemId={item.id} />
          </div>
        </div>
      </div>

      {/* Related items */}
      {related && related.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#e0e0e0] mb-3">
            Mais de {item.platform}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((rel: Item) => (
              <Link
                key={rel.id}
                href={`/collection/${rel.id}`}
                className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden transition-all hover:border-[#00e6e6]/30 hover:shadow-[0_0_16px_rgba(0,230,230,0.08)] group"
              >
                <div className="relative aspect-square bg-[#0a0a0a]">
                  {rel.image_urls?.[0] ? (
                    <Image
                      src={rel.image_urls[0]}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Gamepad2 size={24} className="text-[#2a2a2a]" />
                    </div>
                  )}
                  <span
                    className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${getConditionClass(rel.condition)}`}
                  >
                    {rel.condition}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-[#e0e0e0] text-xs font-medium line-clamp-2 leading-tight">
                    {rel.title}
                  </p>
                  <p
                    className="text-[#00e6e6] text-xs font-bold mt-1.5"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    {formatCurrency(rel.purchase_price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
