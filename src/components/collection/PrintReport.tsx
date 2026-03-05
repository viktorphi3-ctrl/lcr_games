"use client";

import Image from "next/image";
import { formatCurrency, getConditionClass } from "@/lib/utils";
import type { Item } from "@/types";
import { Printer } from "lucide-react";

interface PrintReportProps {
    items: Item[];
}

export function PrintReport({ items }: PrintReportProps) {
    const totalInvested = items.reduce((sum, i) => sum + (i.purchase_price || 0), 0);
    const totalMarket = items.reduce((sum, i) => sum + (i.market_value || 0), 0);
    const dateStr = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* ── Print button (hidden when printing) ── */}
            <div className="no-print sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Pré-visualização do relatório — {items.length} {items.length === 1 ? "item" : "itens"}
                </p>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #00c8c8, #e01068)" }}
                >
                    <Printer size={16} />
                    Imprimir / Salvar PDF
                </button>
            </div>

            {/* ── Report content ── */}
            <div className="max-w-[210mm] mx-auto px-8 py-8 print:px-6 print:py-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-900">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">
                            🎮 LCR GAMERS
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Collection Vault</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Relatório de Coleção</p>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">{dateStr}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {items.length} {items.length === 1 ? "item selecionado" : "itens selecionados"}
                        </p>
                    </div>
                </div>

                {/* Items Grid — 2 columns */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="print-item border border-gray-200 rounded-lg overflow-hidden flex gap-3 p-3"
                        >
                            {/* Image */}
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                {item.image_urls?.[0] ? (
                                    <Image
                                        src={item.image_urls[0]}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-2xl">
                                        🎮
                                    </div>
                                )}
                            </div>

                            {/* Data */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h2 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                                        {item.title}
                                    </h2>
                                    <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${getConditionClass(item.condition)}`}>
                                        {item.condition}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 mb-1.5">
                                    {item.platform}
                                    {item.developer && ` · ${item.developer}`}
                                    {item.release_year && ` · ${item.release_year}`}
                                </p>

                                {item.box_condition && (
                                    <p className="text-xs text-gray-400 mb-1.5">
                                        Caixa: {item.box_condition}
                                    </p>
                                )}

                                <div className="flex items-center gap-3 mt-auto">
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">Pago</p>
                                        <p className="text-sm font-black text-gray-900">
                                            {formatCurrency(item.purchase_price)}
                                        </p>
                                    </div>
                                    {item.market_value != null && (
                                        <div>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Mercado</p>
                                            <p className={`text-sm font-bold ${item.market_value >= item.purchase_price ? "text-emerald-600" : "text-red-500"}`}>
                                                {formatCurrency(item.market_value)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {item.description && (
                                    <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2 italic">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Totals */}
                <div className="border-t-2 border-gray-900 pt-5 mt-2">
                    <div className="grid grid-cols-3 gap-6 mb-4">
                        <div className="text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Itens</p>
                            <p className="text-2xl font-black text-gray-900">{items.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Investido</p>
                            <p className="text-2xl font-black text-gray-900">{formatCurrency(totalInvested)}</p>
                        </div>
                        {totalMarket > 0 && (
                            <div className="text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valor de Mercado</p>
                                <p className={`text-2xl font-black ${totalMarket >= totalInvested ? "text-emerald-600" : "text-red-500"}`}>
                                    {formatCurrency(totalMarket)}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-xs text-gray-300 mt-4">
                        Gerado por LCR Gamers · Collection Vault · {dateStr}
                    </p>
                </div>
            </div>
        </div>
    );
}
