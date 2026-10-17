import {
  isSupabaseConfigured,
  supabase,
  SUPABASE_IMAGE_BUCKET
} from "./supabase-config.js";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp"
]);

export const IMAGE_FOLDERS = Object.freeze({
  products: "products",
  profiles: "profiles",
  exchanges: "exchanges",
  sellers: "sellers"
});

function safeFileName(name) {
  const extension = String(name || "image")
    .split(".")
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") || "jpg";
  const baseName = String(name || "image")
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
  return `${baseName}.${extension}`;
}

function uploadId() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function normalizeFolder(folder) {
  const value = String(folder || "").replace(/^\/+|\/+$/g, "");
  if (!Object.values(IMAGE_FOLDERS).includes(value)) {
    throw new Error("The image upload destination is invalid.");
  }
  return value;
}

export function validateImageFile(file) {
  if (!(file instanceof File) || !file.size) {
    throw new Error("Select an image from your device.");
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Use a JPG, JPEG, PNG or WebP image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("The image must be 5 MB or smaller.");
  }
  return file;
}

export function isHttpsImageUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function createLocalPreviewUrl(file) {
  validateImageFile(file);
  return URL.createObjectURL(file);
}

export function revokeLocalPreviewUrl(url) {
  if (url) URL.revokeObjectURL(url);
}

export async function recordImageUploadMetadata({
  ownerId,
  folder,
  path,
  url,
  recordType = "image",
  relatedRecordId = "",
  file
} = {}) {
  if (!isSupabaseConfigured()) return null;
  const { error } = await supabase.from("image_uploads").insert({
    owner_id: ownerId,
    folder,
    storage_path: path,
    public_url: url,
    record_type: recordType,
    related_record_id: relatedRecordId || null,
    file_name: file?.name || null,
    mime_type: file?.type || null,
    file_size: file?.size || null
  });
  if (error) {
    console.warn("Supabase image metadata could not be saved.", error);
    return null;
  }
  return true;
}

export async function uploadImageFile(file, {
  folder,
  uid,
  ownerId = uid,
  recordType = "image",
  relatedRecordId = "",
  onProgress
} = {}) {
  validateImageFile(file);
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured yet. Add your Supabase URL and anon key in js/supabase-config.js.");
  }
  if (!ownerId) {
    throw new Error("The image owner is unavailable. Please sign in again.");
  }

  const safeFolder = normalizeFolder(folder);
  const path = `${safeFolder}/${ownerId}/${uploadId()}-${safeFileName(file.name)}`;
  onProgress?.(5);

  const { error } = await supabase.storage
    .from(SUPABASE_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

  if (error) {
    throw new Error(error.message || "The image could not be uploaded to Supabase Storage.");
  }

  onProgress?.(90);
  const { data } = supabase.storage.from(SUPABASE_IMAGE_BUCKET).getPublicUrl(path);
  const url = data?.publicUrl || "";
  if (!url) {
    await deleteUploadedImage(path).catch(() => {});
    throw new Error("The uploaded image URL could not be obtained.");
  }

  await recordImageUploadMetadata({
    ownerId,
    folder: safeFolder,
    path,
    url,
    recordType,
    relatedRecordId,
    file
  });

  onProgress?.(100);
  return { url, path };
}

export async function deleteUploadedImage(path) {
  if (!path || !isSupabaseConfigured()) return;
  const { error } = await supabase.storage.from(SUPABASE_IMAGE_BUCKET).remove([path]);
  if (error && !/not found/i.test(error.message || "")) throw error;
}
