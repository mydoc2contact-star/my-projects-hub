"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { STATUS_OPTIONS } from "@/lib/constants";
import { updateProjectStatusAction } from "@/actions/projects";
import type { ProjectStatus } from "@prisma/client";

export function StatusChanger({ id, status }: { id: string; status: ProjectStatus }) {
  const [open, setOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState(status);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateProjectStatusAction(id, nextStatus);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("تم تغيير حالة المشروع");
      setOpen(false);
    });
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        تغيير الحالة
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="تغيير حالة المشروع">
        <Select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as ProjectStatus)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} — {option.description}
            </option>
          ))}
        </Select>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
            إلغاء
          </Button>
          <Button onClick={save} disabled={pending}>
            {pending ? "جارٍ الحفظ..." : "حفظ الحالة"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
