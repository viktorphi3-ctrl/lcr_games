import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ItemCondition } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getConditionClass(condition: ItemCondition): string {
  const map: Record<ItemCondition, string> = {
    CIB: "badge-cib",
    MINT: "badge-sealed",
    LOOSE: "badge-loose",
    RELABEL: "badge-restored",
  };
  return map[condition] ?? "badge-loose";
}

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
  return formatDate(dateString);
}

export function getPlatformAbbr(platform: string): string {
  const map: Record<string, string> = {
    "Nintendo Entertainment System": "NES",
    "Super Nintendo": "SNES",
    "Nintendo 64": "N64",
    "GameCube": "GCN",
    "Wii": "Wii",
    "Nintendo Switch": "NSW",
    "Game Boy": "GB",
    "Game Boy Color": "GBC",
    "Game Boy Advance": "GBA",
    "Nintendo DS": "NDS",
    "Sega Genesis": "GEN",
    "Sega Saturn": "SAT",
    "Sega Dreamcast": "DC",
    "PlayStation": "PS1",
    "PlayStation 2": "PS2",
    "PlayStation 3": "PS3",
    "PlayStation 4": "PS4",
    "Xbox": "XBOX",
    "Xbox 360": "X360",
    "Atari 2600": "AT26",
    "Neo Geo": "NEO",
  };
  return map[platform] ?? platform.substring(0, 4).toUpperCase();
}
