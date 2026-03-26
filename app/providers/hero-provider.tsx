"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

export function HeroProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      {children}
    </HeroUIProvider>
  );
}
