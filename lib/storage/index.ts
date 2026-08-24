import { LocalStorageProvider } from "./local";
import type { StorageProvider } from "./types";

export type { StorageFile, StorageProvider } from "./types";

// Swap this implementation later (S3, Cloudinary, etc.) without touching the rest of the app.
export const storage: StorageProvider = new LocalStorageProvider();
