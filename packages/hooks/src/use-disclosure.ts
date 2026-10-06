"use client";

import { useCallback, useState } from "react";

export function useDisclosure(initiallyOpen = false) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);

  return { close, isOpen, open, toggle };
}
