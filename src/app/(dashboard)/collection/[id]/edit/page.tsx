export const dynamic = "force-dynamic";
export const runtime = "edge";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ItemForm } from "@/app/(dashboard)/add/page";

export default async function EditItemPage({
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

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/collection/${id}`}
          className="text-[#555555] hover:text-[#00e6e6] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#e0e0e0]">Editar Item</h1>
          <p className="text-[#555555] text-sm truncate max-w-xs">{item.title}</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5 md:p-6">
        <ItemForm
          itemId={id}
          existingImages={item.image_urls || []}
          defaultValues={{
            type: item.type,
            title: item.title,
            description: item.description || "",
            release_year: item.release_year?.toString() || "",
            platform: item.platform,
            condition: item.condition,
            purchase_price: item.purchase_price?.toString() || "",
          }}
        />
      </div>
    </div>
  );
}
