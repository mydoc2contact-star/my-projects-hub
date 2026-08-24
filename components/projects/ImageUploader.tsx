"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

type ExistingImage = { id: string; url: string };

type ImageUploaderProps = {
  mainImageUrl?: string | null;
  existingImages?: ExistingImage[];
  onRemovedExistingChange?: (ids: string[]) => void;
};

export function ImageUploader({
  mainImageUrl,
  existingImages = [],
  onRemovedExistingChange,
}: ImageUploaderProps) {
  const [mainPreview, setMainPreview] = useState<string | null>(mainImageUrl ?? null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const visibleExisting = useMemo(
    () => existingImages.filter((image) => !removedIds.includes(image.id)),
    [existingImages, removedIds],
  );

  function handleMainChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMainPreview(URL.createObjectURL(file));
  }

  function handleAdditionalChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setAdditionalPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function removeExisting(id: string) {
    const next = [...removedIds, id];
    setRemovedIds(next);
    onRemovedExistingChange?.(next);
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">الصورة الرئيسية</p>
        <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-page text-sm text-muted">
          {mainPreview ? (
            <span className="relative block h-44 w-full">
              <Image src={mainPreview} alt="الصورة الرئيسية" fill className="object-cover" unoptimized />
            </span>
          ) : (
            <span className="flex flex-col items-center gap-2 p-6">
              <ImagePlus className="h-6 w-6" />
              اختر صورة رئيسية
            </span>
          )}
          <input
            type="file"
            name="mainImage"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={handleMainChange}
          />
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">صور إضافية</p>
        <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-page p-4 text-sm text-muted">
          <ImagePlus className="mb-2 h-6 w-6" />
          أضف مجموعة صور
          <input
            type="file"
            name="additionalImages"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="sr-only"
            onChange={handleAdditionalChange}
          />
        </label>
      </div>

      {(visibleExisting.length > 0 || additionalPreviews.length > 0) && (
        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          {visibleExisting.map((image) => (
            <div key={image.id} className="relative h-24 overflow-hidden rounded-xl border border-line">
              <Image src={image.url} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeExisting(image.id)}
                className="absolute start-1 top-1 rounded-full bg-white/90 p-1 text-ink"
                aria-label="حذف الصورة"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {additionalPreviews.map((src) => (
            <div key={src} className="relative h-24 overflow-hidden rounded-xl border border-line">
              <Image src={src} alt="" fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
