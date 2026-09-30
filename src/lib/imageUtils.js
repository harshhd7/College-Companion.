import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Format bytes into human readable format (KB, MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Compress an image file using browser Canvas API
 * - Resizes images exceeding maxWidth / maxHeight preserving aspect ratio
 * - Compresses JPEG / WebP with balanced quality for clear item identification
 * - Avoids uploading massive 10MB phone camera shots
 */
export async function compressImage(
  file,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.82, outputType = "image/jpeg" } = {}
) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("File provided is not a valid image"));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Canvas 2D context unavailable"));
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Canvas image conversion to blob failed"));
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: outputType,
              lastModified: Date.now(),
            });

            const dataUrl = canvas.toDataURL(outputType, quality);

            resolve({
              file: compressedFile,
              dataUrl,
              originalSize: file.size,
              compressedSize: blob.size,
              savingsPercent: Math.max(
                0,
                Math.round(((file.size - blob.size) / file.size) * 100)
              ),
              width,
              height,
            });
          },
          outputType,
          quality
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a compressed photo to Supabase Storage bucket 'lost-found'
 * Path structure: lost-found/{user_id}/{item_id}/{filename}
 */
export async function uploadLostFoundImage(file, userId = "anonymous", itemId = "item-draft") {
  const cleanUserId = userId ? String(userId).replace(/[^a-zA-Z0-9_-]/g, "") : "student";
  const cleanItemId = itemId ? String(itemId).replace(/[^a-zA-Z0-9_-]/g, "") : "draft";
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanExt = (file.name.split(".").pop() || "jpg").toLowerCase();
  const fileName = `img_${timestamp}_${randomSuffix}.${cleanExt}`;
  const filePath = `${cleanUserId}/${cleanItemId}/${fileName}`;

  // If Supabase client is configured, upload to real bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from("lost-found")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "image/jpeg",
        });

      if (error) {
        console.warn("Supabase Storage upload warning, falling back to local object storage:", error.message);
        // Fall back to object URL / data URL for client resilience
        return {
          publicUrl: URL.createObjectURL(file),
          path: filePath,
          storageType: "blob-fallback",
        };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("lost-found")
        .getPublicUrl(data.path);

      return {
        publicUrl: publicUrlData.publicUrl,
        path: data.path,
        storageType: "supabase-storage",
      };
    } catch (err) {
      console.warn("Upload exception:", err);
      return {
        publicUrl: URL.createObjectURL(file),
        path: filePath,
        storageType: "blob-fallback",
      };
    }
  }

  // Graceful offline/local mode fallback: creates a valid browser blob URL
  return {
    publicUrl: URL.createObjectURL(file),
    path: filePath,
    storageType: "blob-local",
  };
}
