"use client";

import { useEffect } from "react";

const internalAppUrl =
  process.env.NEXT_PUBLIC_INTERNAL_APP_URL ?? "http://localhost:3001";

export default function ExternalProfileRedirect() {
  useEffect(() => {
    window.location.assign(`${internalAppUrl}/profile`);
  }, []);

  return null;
}
