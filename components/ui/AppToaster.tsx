"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      dir="rtl"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "font-[IBM_Plex_Sans_Arabic] text-sm",
        },
      }}
    />
  );
}
