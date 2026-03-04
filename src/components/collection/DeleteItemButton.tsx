"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteItemButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja deletar este item permanentemente?"))
      return;
    setLoading(true);
    await supabase.from("items").delete().eq("id", itemId);
    router.push("/collection");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all text-[#ff1a75]/60 hover:text-[#ff1a75] hover:bg-[#ff1a75]/10 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Excluindo...
        </>
      ) : (
        <>
          <Trash2 size={16} />
          Excluir Item
        </>
      )}
    </button>
  );
}
