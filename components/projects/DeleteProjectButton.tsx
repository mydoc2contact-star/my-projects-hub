"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { deleteProjectAction } from "@/actions/projects";

export function DeleteProjectButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteProjectAction(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("تم حذف المشروع");
      setOpen(false);
      router.push("/projects");
      router.refresh();
    });
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        حذف المشروع
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="هل أنت متأكد من حذف هذا المشروع؟"
        description={`سيتم حذف “${name}” وجميع صوره وروابطه بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={pending}>
            {pending ? "جارٍ الحذف..." : "نعم، احذف المشروع"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
