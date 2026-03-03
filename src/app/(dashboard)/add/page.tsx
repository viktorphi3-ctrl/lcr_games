"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImages, validateImageFile } from "@/lib/image-compression";
import {
  Upload,
  X,
  Loader2,
  Save,
  ChevronLeft,
  ImagePlus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ItemType, ItemCondition } from "@/types";

const PLATFORMS = [
  "Nintendo Entertainment System",
  "Super Nintendo",
  "Nintendo 64",
  "GameCube",
  "Wii",
  "Nintendo Switch",
  "Game Boy",
  "Game Boy Color",
  "Game Boy Advance",
  "Nintendo DS",
  "Sega Genesis",
  "Sega Saturn",
  "Sega Dreamcast",
  "PlayStation",
  "PlayStation 2",
  "PlayStation 3",
  "PlayStation 4",
  "Xbox",
  "Xbox 360",
  "Atari 2600",
  "Neo Geo",
  "PC Engine",
  "Outro",
];

const CONDITIONS: ItemCondition[] = ["CIB", "Loose", "Sealed", "Damaged", "Restored"];

interface FormState {
  type: ItemType;
  title: string;
  description: string;
  release_year: string;
  platform: string;
  condition: ItemCondition;
  purchase_price: string;
}

const INITIAL: FormState = {
  type: "game",
  title: "",
  description: "",
  release_year: "",
  platform: "",
  condition: "CIB",
  purchase_price: "",
};

interface ItemFormProps {
  defaultValues?: Partial<FormState>;
  itemId?: string;
  existingImages?: string[];
}

function ItemForm({ defaultValues, itemId, existingImages = [] }: ItemFormProps) {
  const [form, setForm] = useState<FormState>({ ...INITIAL, ...defaultValues });
  const [imagePreviews, setImagePreviews] = useState<string[]>(existingImages);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 3 - imagePreviews.length;
    const toAdd = files.slice(0, remaining);

    setImageError(null);
    for (const f of toAdd) {
      const err = validateImageFile(f);
      if (err) { setImageError(err); return; }
    }

    // Show preview immediately
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    // Only remove from files if it's a new file (not existing)
    const newFileIndex = index - existingImages.length;
    if (newFileIndex >= 0) {
      setImageFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.platform) {
      setError("Título e plataforma são obrigatórios.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      let uploadedUrls: string[] = [...existingImages];

      // Upload new images
      if (imageFiles.length > 0) {
        const compressed = await compressImages(imageFiles);
        for (const file of compressed) {
          const path = `${user.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("item-images")
            .upload(path, file, { upsert: false });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("item-images")
            .getPublicUrl(path);
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      const payload = {
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim() || null,
        release_year: form.release_year ? parseInt(form.release_year) : null,
        platform: form.platform,
        condition: form.condition,
        purchase_price: parseFloat(form.purchase_price) || 0,
        image_urls: uploadedUrls.slice(0, 3),
        user_id: user.id,
      };

      if (itemId) {
        const { error } = await supabase
          .from("items")
          .update(payload)
          .eq("id", itemId);
        if (error) throw error;
        router.push(`/collection/${itemId}`);
      } else {
        const { data, error } = await supabase
          .from("items")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        router.push(`/collection/${data.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar item.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-[#0a0a0a] border border-[#1e1e1e] text-[#e0e0e0] rounded-xl px-4 py-3 text-sm placeholder:text-[#3a3a3a] focus:outline-none focus:border-[#00e6e6] focus:shadow-[0_0_0_1px_#00e6e6] transition-all";
  const labelClass = "block text-xs font-medium text-[#888888] uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type */}
      <div>
        <label className={labelClass}>Tipo</label>
        <div className="flex gap-2">
          {(["game", "console"] as ItemType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("type", t)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${form.type === t
                  ? "border-[#00e6e6]/50 bg-[#00e6e6]/10 text-[#00e6e6] shadow-[0_0_12px_rgba(0,230,230,0.1)]"
                  : "border-[#1e1e1e] text-[#555555] hover:border-[#333333] hover:text-[#e0e0e0]"
                }`}
            >
              {t === "game" ? "🎮 Jogo" : "🖥️ Console"}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Título *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
          placeholder="Ex: Super Mario Bros. 3"
          className={inputClass}
        />
      </div>

      {/* Platform + Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Plataforma *</label>
          <select
            value={form.platform}
            onChange={(e) => set("platform", e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Selecionar...</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Ano de Lançamento</label>
          <input
            type="number"
            value={form.release_year}
            onChange={(e) => set("release_year", e.target.value)}
            placeholder="1990"
            min="1970"
            max="2030"
            className={inputClass}
          />
        </div>
      </div>

      {/* Condition + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Condição</label>
          <select
            value={form.condition}
            onChange={(e) => set("condition", e.target.value as ItemCondition)}
            className={inputClass}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Preço Pago (R$)</label>
          <input
            type="number"
            value={form.purchase_price}
            onChange={(e) => set("purchase_price", e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Notas / Observações</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Condição detalhada, origem, notas pessoais..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>
          Fotos ({imagePreviews.length}/3) — Compressão automática para WebP
        </label>

        <div className="flex gap-3 flex-wrap">
          {imagePreviews.map((src, i) => (
            <div
              key={i}
              className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#1e1e1e] bg-[#0a0a0a] group"
            >
              <Image src={src} alt={`preview ${i}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-[#ff1a75] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}

          {imagePreviews.length < 3 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-xl border border-dashed border-[#2a2a2a] bg-[#0a0a0a] flex flex-col items-center justify-center gap-1 hover:border-[#00e6e6]/40 hover:bg-[#00e6e6]/5 transition-all"
            >
              <ImagePlus size={20} className="text-[#2a2a2a]" />
              <span className="text-[10px] text-[#444444]">Adicionar</span>
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          className="hidden"
        />

        {imageError && (
          <p className="text-[#ff1a75] text-xs mt-2">{imageError}</p>
        )}
        <p className="text-[#3a3a3a] text-xs mt-2">
          Imagens são comprimidas automaticamente para WebP &lt;500KB antes do upload.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#ff1a75]/10 border border-[#ff1a75]/30 rounded-xl px-4 py-3">
          <p className="text-[#ff1a75] text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Link
          href={itemId ? `/collection/${itemId}` : "/collection"}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#1e1e1e] text-[#555555] hover:text-[#e0e0e0] hover:border-[#333333] transition-all text-sm"
        >
          <ChevronLeft size={16} />
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: saving
              ? "#1a1a1a"
              : "linear-gradient(135deg, #00e6e6, #ff1a75)",
            color: saving ? "#555555" : "#0a0a0a",
            boxShadow: saving ? "none" : "0 0 20px rgba(0, 230, 230, 0.2)",
          }}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {imageFiles.length > 0 ? "Comprimindo e salvando..." : "Salvando..."}
            </>
          ) : (
            <>
              <Save size={16} />
              {itemId ? "Salvar Alterações" : "Adicionar à Coleção"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function AddPage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/collection"
          className="text-[#555555] hover:text-[#00e6e6] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#e0e0e0]">
            Adicionar Item
          </h1>
          <p className="text-[#555555] text-sm">
            Novo console ou jogo na coleção
          </p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5 md:p-6">
        <ItemForm />
      </div>
    </div>
  );
}

export { ItemForm };
