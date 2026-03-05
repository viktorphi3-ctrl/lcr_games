"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Gamepad2, Monitor, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    title: string;
    itemType: "game" | "console" | "accessory";
}

export function ImageGallery({ images, title, itemType }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const prev = useCallback(() => {
        setSelectedIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const next = useCallback(() => {
        setSelectedIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    const emptySlots = Math.max(0, 3 - images.length);

    return (
        <>
            {/* Main Image */}
            <div className="space-y-3">
                <div
                    onClick={() => images.length > 0 && openLightbox(selectedIndex)}
                    className={`relative aspect-square bg-[#111111] rounded-2xl overflow-hidden border border-[#1e1e1e] ${images.length > 0 ? "cursor-zoom-in group" : ""}`}
                >
                    {images[selectedIndex] ? (
                        <>
                            <Image
                                src={images[selectedIndex]}
                                alt={title}
                                fill
                                className="object-contain p-4 group-hover:scale-[1.02] transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                <ZoomIn
                                    size={32}
                                    className="text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            {itemType === "console" ? (
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
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-[#111111] cursor-pointer transition-all focus:outline-none ${i === selectedIndex
                                    ? "border-[#00e6e6] shadow-[0_0_10px_rgba(0,230,230,0.3)]"
                                    : "border-[#1e1e1e] hover:border-[#00e6e6]/50 opacity-60 hover:opacity-100"
                                }`}
                            aria-label={`Ver foto ${i + 1}`}
                        >
                            <Image
                                src={url}
                                alt={`${title} ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="w-20 h-20 rounded-xl border border-dashed border-[#222222] bg-[#0a0a0a] flex items-center justify-center"
                        >
                            <span className="text-[#2a2a2a] text-lg font-light">+</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>

                    {/* Counter */}
                    {images.length > 1 && (
                        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                            {selectedIndex + 1} / {images.length}
                        </span>
                    )}

                    {/* Prev button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
                            aria-label="Foto anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative w-[90vw] h-[85vh] max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${title} - foto ${selectedIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="90vw"
                            priority
                        />
                    </div>

                    {/* Next button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
                            aria-label="Próxima foto"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === selectedIndex
                                            ? "border-[#00e6e6] opacity-100"
                                            : "border-transparent opacity-50 hover:opacity-80"
                                        }`}
                                >
                                    <Image src={url} alt={`miniatura ${i + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
