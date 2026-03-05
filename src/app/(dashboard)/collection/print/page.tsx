export const dynamic = "force-dynamic";
export const runtime = "edge";

import { createClient } from "@/lib/supabase/server";
import { PrintReport } from "@/components/collection/PrintReport";
import Link from "next/link";

export default async function PrintPage({
    searchParams,
}: {
    searchParams: Promise<{ ids?: string }>;
}) {
    const { ids } = await searchParams;
    const idList = (ids || "").split(",").map((s) => s.trim()).filter(Boolean);

    if (idList.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-center p-8">
                <div>
                    <p className="text-2xl mb-2">⚠️</p>
                    <p className="text-gray-600 text-sm mb-4">Nenhum item foi selecionado para o relatório.</p>
                    <Link href="/collection" className="text-sm text-blue-600 hover:underline">
                        ← Voltar para a Coleção
                    </Link>
                </div>
            </div>
        );
    }

    const supabase = await createClient();
    const { data: items } = await supabase
        .from("items")
        .select("*")
        .in("id", idList);

    if (!items || items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-center p-8">
                <div>
                    <p className="text-2xl mb-2">❌</p>
                    <p className="text-gray-600 text-sm mb-4">Itens não encontrados.</p>
                    <Link href="/collection" className="text-sm text-blue-600 hover:underline">
                        ← Voltar para a Coleção
                    </Link>
                </div>
            </div>
        );
    }

    // Maintain the selection order
    const ordered = idList
        .map((id) => items.find((i) => i.id === id))
        .filter(Boolean) as typeof items;

    return <PrintReport items={ordered} />;
}
