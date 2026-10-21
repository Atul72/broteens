"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout, useAuthSession } from "@broteens/features";
import { ReachdeskLogo } from "./ReachdeskLogo";
import {
  LayoutTemplate,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";
const externalAppUrl =
  process.env.NEXT_PUBLIC_EXTERNAL_APP_URL ?? "http://localhost:3000";

export interface SidebarProps {
  /**
   * Controls mobile sidebar drawer visibility.
   */
  isOpen: boolean;
  /**
   * Closes the mobile sidebar drawer.
   */
  onClose: () => void;
  /**
   * Desktop collapsed state (rail mode: icons only).
   */
  isCollapsed?: boolean;
  /**
   * Toggles desktop collapsed state.
   */
  onToggleCollapse?: () => void;
  /**
   * Optional extra CSS classes.
   */
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Templates",
    href: "/templates",
    icon: LayoutTemplate,
  },
];

function getInitials(fullName?: string | null, email?: string | null): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.trim().slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.trim().slice(0, 2).toUpperCase();
  }
  return "U";
}

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const { session, clearSession } = useAuthSession();
  const [avatarError, setAvatarError] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Handle escape key to close mobile drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    if (session?.refreshToken) {
      void logout(authApiUrl, session.refreshToken).catch(() => {});
    }
    clearSession();
    window.location.assign(`${externalAppUrl}/login`);
  };

  const user = session?.user;
  const avatarUrl = user?.avatarUrl;
  const userType = user?.userType || "external";

  const renderNavList = (isMobileMode: boolean) => (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {!isCollapsed || isMobileMode ? "Modules" : "•••"}
      </div>

      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (isMobileMode) onClose();
            }}
            title={isCollapsed && !isMobileMode ? item.name : undefined}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              isActive
                ? "bg-lavender-50 text-lavender-700 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
            } ${isCollapsed && !isMobileMode ? "justify-center px-2" : ""}`}
          >
            <Icon
              className={`w-5 h-5 shrink-0 transition-colors ${
                isActive
                  ? "text-lavender-600"
                  : "text-slate-500 group-hover:text-slate-800"
              }`}
            />

            {(!isCollapsed || isMobileMode) && (
              <span className="truncate">{item.name}</span>
            )}
          </Link>
        );
      })}

      <div className="pt-4 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {!isCollapsed || isMobileMode ? "Preferences" : "•••"}
      </div>

      <Link
        href="/profile"
        onClick={() => {
          if (isMobileMode) onClose();
        }}
        title={isCollapsed && !isMobileMode ? "Settings" : undefined}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
          pathname === "/profile"
            ? "bg-lavender-50 text-lavender-700 font-semibold"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
        } ${isCollapsed && !isMobileMode ? "justify-center px-2" : ""}`}
      >
        <Settings
          className={`w-5 h-5 shrink-0 transition-colors ${
            pathname === "/profile"
              ? "text-lavender-600"
              : "text-slate-500 group-hover:text-slate-800 group-hover:rotate-45"
          }`}
        />
        {(!isCollapsed || isMobileMode) && (
          <span className="truncate">Settings & Profile</span>
        )}
      </Link>
    </div>
  );

  const renderUserProfile = (isMobileMode: boolean) => (
    <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
      <div
        className={`flex items-center gap-3 ${
          isCollapsed && !isMobileMode ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {avatarUrl && !avatarError ? (
            <Image
              src={avatarUrl}
              alt={user?.fullName || "User"}
              width={36}
              height={36}
              unoptimized
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-lavender-200/60 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-lavender-600 text-white font-bold text-xs grid place-items-center uppercase shadow-xs shrink-0">
              {getInitials(user?.fullName, user?.email)}
            </div>
          )}

          {(!isCollapsed || isMobileMode) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.fullName || "Workspace Member"}
                </p>
                <span className="inline-block text-[10px] font-semibold text-lavender-700 bg-lavender-100/80 px-1.5 py-0.2 rounded uppercase">
                  {userType}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.email || "user@broteens.com"}
              </p>
            </div>
          )}
        </div>

        {(!isCollapsed || isMobileMode) && (
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. Mobile Slide-over Drawer (< md screen size)
         ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-0 z-50 md:hidden flex"
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Header with Logo and Close button */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/80">
              <Link
                href="/templates"
                onClick={onClose}
                className="flex items-center"
              >
                <ReachdeskLogo iconClassName="w-7 h-7 text-lavender-600" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation items */}
            {renderNavList(true)}

            {/* Footer with user info & logout */}
            {renderUserProfile(true)}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Desktop Persistent Sidebar (>= md screen size)
         ───────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Workspace Sidebar"
        className={`relative hidden md:flex flex-col border-r border-slate-200/80 bg-white shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        } ${className}`}
      >
        {/* Header with Logo & Desktop Collapse Toggle */}
        <div
          className={`flex items-center h-16 px-4 border-b border-slate-200/80 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link
            href="/templates"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-500 rounded-lg"
          >
            {isCollapsed ? (
              <ReachdeskLogo
                showText={false}
                iconClassName="w-7 h-7 text-lavender-600"
              />
            ) : (
              <ReachdeskLogo iconClassName="w-7 h-7 text-lavender-600" />
            )}
          </Link>

          {onToggleCollapse && !isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand toggle button */}
        {onToggleCollapse && isCollapsed && (
          <div className="py-2 flex justify-center border-b border-slate-100">
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Desktop Navigation List */}
        {renderNavList(false)}

        {/* Desktop User Profile Footer */}
        {renderUserProfile(false)}
      </aside>
    </>
  );
}
export default Sidebar;
