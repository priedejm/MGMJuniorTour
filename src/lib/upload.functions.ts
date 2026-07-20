import { apiUpload } from "./api-client";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type UploadFolder = "photos" | "results" | "packages" | "misc";

export async function uploadImage(
  file: File,
  folder: UploadFolder,
  entityId = "new",
): Promise<{ url: string; path: string }> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPEG, PNG, or WebP images are allowed");
  }
  if (file.size === 0) throw new Error("Empty file");
  if (file.size > MAX_BYTES) {
    throw new Error(`Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB) — max 8 MB`);
  }

  const form = new FormData();
  form.append("entity", folder);
  form.append("entityId", entityId);
  form.append("file", file);

  return apiUpload<{ ok: true; url: string; path: string }>("/upload-image.php", form);
}
