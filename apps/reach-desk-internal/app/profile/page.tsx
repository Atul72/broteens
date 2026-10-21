"use client";

import { useState } from "react";
import { SettingsScreen } from "@broteens/features";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full min-h-screen flex bg-slate-50 selection:bg-lavender-200 selection:text-lavender-900">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      <div className="flex-1 min-w-0 flex flex-col w-full min-h-screen">
        <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
              className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-lavender-600" />
              <span className="text-xs font-semibold">Menu</span>
            </button>

            <h1 className="text-base sm:text-lg font-bold text-slate-900">
              Settings &amp; Profile
            </h1>
          </div>
        </header>

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
          <SettingsScreen apiBaseUrl={authApiUrl} />
        </main>
      </div>
    </div>
  );
}
