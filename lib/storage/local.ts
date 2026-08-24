import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import type { StorageFile, StorageProvider } from "./types";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function getUploadRoot() {
  return path.join(process.cwd(), process.env.UPLOAD_DIR || "public/uploads");
}

function extensionFromType(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export class LocalStorageProvider implements StorageProvider {
  async upload(file: File, folder = "projects"): Promise<StorageFile> {
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error("صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP.");
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new Error("حجم الصورة يجب ألا يتجاوز 5 ميغابايت.");
    }

    const root = getUploadRoot();
    const destDir = path.join(root, folder);
    await mkdir(destDir, { recursive: true });

    const filename = `${crypto.randomUUID()}.${extensionFromType(file.type)}`;
    const destPath = path.join(destDir, filename);
    const key = `${folder}/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(destPath, buffer);

    return {
      key,
      url: `/uploads/${key}`,
    };
  }

  async remove(urlOrKey: string): Promise<void> {
    const key = urlOrKey.replace(/^\/uploads\//, "");
    if (!key || key.includes("..")) return;

    const filePath = path.join(getUploadRoot(), key);
    try {
      await unlink(filePath);
    } catch {
      // File may already be gone; ignore.
    }
  }
}
