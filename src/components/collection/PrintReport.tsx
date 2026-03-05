"use client";

import { formatCurrency, getConditionClass } from "@/lib/utils";
import type { Item } from "@/types";
import { Printer } from "lucide-react";

interface PrintReportProps {
    items: Item[];
}

export function PrintReport({ items }: PrintReportProps) {
    const totalMarket = items.reduce((sum, i) => sum + (i.market_value || 0), 0);
    const dateStr = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Print button — hidden on print */}
            <div className="no-print sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Pré-visualização — {items.length} {items.length === 1 ? "item" : "itens"}
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

            {/* Report */}
            <div className="max-w-[210mm] mx-auto px-8 py-8 print:px-6 print:py-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-5 border-b-2 border-gray-900">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">🎮 LCR GAMERS</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Collection Vault</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Relatório de Coleção</p>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">{dateStr}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {items.length} {items.length === 1 ? "item" : "itens"}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full border-collapse text-sm mb-8">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="text-left py-2 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500 w-[28%]">Nome</th>
                            <th className="text-left py-2 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500 w-[35%]">Descrição</th>
                            <th className="text-right py-2 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500 w-[16%]">Valor de Mercado</th>
                            <th className="text-center py-2 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500 w-[10%]">Estado</th>
                            <th className="text-center py-2 text-xs font-bold uppercase tracking-wider text-gray-500 w-[11%]">Caixa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr
                                key={item.id}
                                className={`print-item border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                                <td className="py-3 pr-3 font-semibold text-gray-900 align-top">
                                    <span className="block">{item.title}</span>
                                    <span className="text-[10px] text-gray-400 font-normal">{item.platform}</span>
                                </td>
                                <td className="py-3 pr-3 text-gray-600 text-xs align-top leading-relaxed">
                                    {item.description || <span className="text-gray-300 italic">—</span>}
                                </td>
                                <td className="py-3 pr-3 text-right font-bold align-top">
                                    {item.market_value != null
                                        ? formatCurrency(item.market_value)
                                        : <span className="text-gray-300">—</span>}
                                </td>
                                <td className="py-3 pr-3 text-center align-top">
                                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${getConditionClass(item.condition)}`}>
                                        {item.condition}
                                    </span>
                                </td>
                                <td className="py-3 text-center text-xs text-gray-600 align-top">
                                    {item.box_condition || <span className="text-gray-300">—</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer / Total */}
                <div className="border-t-2 border-gray-900 pt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        Gerado por LCR Gamers · Collection Vault · {dateStr}
                    </p>
                    {totalMarket > 0 && (
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Valor Total de Mercado</p>
                            <p className="text-xl font-black text-gray-900">{formatCurrency(totalMarket)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
