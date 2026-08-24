"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export type LinkRow = { title: string; url: string };

export function LinksField({
  initialLinks = [],
}: {
  initialLinks?: LinkRow[];
}) {
  const [links, setLinks] = useState<LinkRow[]>(
    initialLinks.length > 0 ? initialLinks : [{ title: "", url: "" }],
  );

  function update(index: number, key: keyof LinkRow, value: string) {
    setLinks((current) => current.map((link, i) => (i === index ? { ...link, [key]: value } : link)));
  }

  const filled = links.filter((link) => link.title.trim() && link.url.trim());

  return (
    <div className="space-y-3">
      <input type="hidden" name="links" value={JSON.stringify(filled)} />
      {links.map((link, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
          <Input
            placeholder="عنوان الرابط"
            value={link.title}
            onChange={(event) => update(index, "title", event.target.value)}
          />
          <Input
            placeholder="https://..."
            value={link.url}
            dir="ltr"
            onChange={(event) => update(index, "url", event.target.value)}
          />
          <Button
            variant="ghost"
            className="h-11 w-11 px-0"
            onClick={() => setLinks((current) => current.filter((_, i) => i !== index))}
            aria-label="حذف الرابط"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setLinks((current) => [...current, { title: "", url: "" }])}
      >
        <Plus className="h-4 w-4" />
        إضافة رابط
      </Button>
    </div>
  );
}
