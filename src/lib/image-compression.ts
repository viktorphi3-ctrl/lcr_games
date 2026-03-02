import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1280,
  useWebWorker: true,
  fileType: "image/webp" as const,
  initialQuality: 0.8,
};

export async function compressImage(file: File): Promise<File> {
  try {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    const webpFile = new File(
      [compressed],
      file.name.replace(/\.[^.]+$/, ".webp"),
      { type: "image/webp" }
    );
    return webpFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error("Falha ao comprimir imagem. Tente novamente.");
  }
}

export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImage));
}

export function validateImageFile(file: File): string | null {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"];
  if (!validTypes.includes(file.type)) {
    return "Formato inválido. Use JPG, PNG, WebP ou HEIC.";
  }
  if (file.size > 50 * 1024 * 1024) {
    return "Arquivo muito grande. Máximo 50MB antes da compressão.";
  }
  return null;
}
