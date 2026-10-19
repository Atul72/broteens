"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout, useAuthSession } from "@broteens/features";
import { ReachdeskLogo } from "./ReachdeskLogo";
import { ChevronDown, LogOut, Wrench } from "lucide-react";

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:4000/v1/auth";

// Function to greet the user
function getGreeting(fullName?: string | null, email?: string | null): string {
  const hour = new Date().getHours();
  let timeGreeting = "Good afternoon";
  if (hour < 12) {
    timeGreeting = "Good morning";
  } else if (hour >= 17) {
    timeGreeting = "Good evening";
  }

  const name =
    fullName?.trim().split(" ")[0] || (email ? email.split("@")[0] : "there");

  return `${timeGreeting}, ${name}`;
}

// function getRoleLabel(role?: string | null): string {
//   if (!role) return "Workspace Member";
//   const map: Record<string, string> = {
//     superadmin: "Super Admin",
//     admin: "Admin",
//     moderator: "Manager",
//     user: "Manager",
//   };
//   return (
//     map[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1)
//   );
// }

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { session, clearSession } = useAuthSession();
  const pathname = usePathname();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const isFeaturesPage = pathname === "/features";
  const isHomePage = pathname === "/" || pathname === "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [profileMenuOpen]);

  // Close profile dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    if (session?.refreshToken) {
      void logout(authApiUrl, session.refreshToken).catch(() => {});
    }
    clearSession();
    window.location.assign("/login");
  };

  const isLoggedIn = mounted && !!session;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-white/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-500 rounded-lg"
          >
            <ReachdeskLogo iconClassName="w-8 h-8 text-lavender-600" />
          </Link>

          {/* Desktop Navigation Links: Completely removed when user is logged in */}
          {!isLoggedIn && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                href="/"
                className={`px-3.5 py-2 text-sm rounded-full transition-colors ${
                  isHomePage
                    ? "font-semibold text-lavender-700 bg-lavender-50/80"
                    : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Home
              </Link>
              <Link
                href="/features"
                className={`px-3.5 py-2 text-sm rounded-full transition-colors ${
                  isFeaturesPage
                    ? "font-semibold text-lavender-700 bg-lavender-50/80"
                    : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/#about"
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
              >
                About
              </Link>
              <div className="relative group">
                <button
                  type="button"
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors inline-flex items-center gap-1"
                >
                  Resources
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-1 w-48 rounded-xl bg-white shadow-xl border border-slate-100 p-2 hidden group-hover:block transition-all animate-in fade-in-50 zoom-in-95">
                  <Link
                    href="/features#templates"
                    className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-lavender-50 hover:text-lavender-700 rounded-lg"
                  >
                    Template Library
                  </Link>
                  <Link
                    href="/features#channels"
                    className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-lavender-50 hover:text-lavender-700 rounded-lg"
                  >
                    Campaign Guides
                  </Link>
                  <a
                    href="#api"
                    className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-lavender-50 hover:text-lavender-700 rounded-lg"
                  >
                    API &amp; Webhooks
                  </a>
                </div>
              </div>
            </nav>
          )}

          {/* Right Action: Profile dropdown when logged in, or Auth buttons when guest */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-slate-800 transition-all border ${
                    profileMenuOpen
                      ? "bg-lavender-50/90 border-lavender-300 shadow-sm ring-2 ring-lavender-400/20"
                      : "hover:bg-lavender-50/80 border-slate-200/90"
                  } focus:outline-none`}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                  aria-label="Open user profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-lavender-600 text-white font-bold text-xs grid place-items-center uppercase shadow-sm shrink-0">
                    {session.user.fullName
                      ? session.user.fullName.slice(0, 2)
                      : session.user.email.slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 max-w-[130px] truncate">
                    {session.user.fullName || session.user.email.split("@")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      profileMenuOpen ? "rotate-180 text-lavender-600" : ""
                    }`}
                  />
                </button>

                {/* Floating Profile Dropdown Card */}
                {profileMenuOpen && (
                  <div
                    role="menu"
                    aria-orientation="vertical"
                    className="absolute right-0 top-full mt-2.5 w-64 rounded-2xl bg-white border border-slate-100 p-4 shadow-xl shadow-slate-900/10 animate-in fade-in-50 zoom-in-95 z-50 text-left"
                  >
                    {/* Header: Greeting & Role */}
                    <div className="px-1 pt-0.5">
                      <h4 className="text-[15px] font-bold text-slate-900 tracking-tight leading-snug">
                        {getGreeting(session.user.fullName, session.user.email)}
                      </h4>
                      {/* <p className="text-xs text-slate-400 font-normal mt-0.5">
                        {getRoleLabel(session.user.role)}
                      </p> */}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 my-3" />

                    {/* Options */}
                    <div className="flex flex-col gap-1.5">
                      {/* Option 1: Profile settings */}
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#F4EEFB] hover:bg-lavender-100 text-lavender-900 font-medium text-sm transition-colors group"
                      >
                        <Wrench className="w-4 h-4 text-lavender-600 shrink-0 group-hover:rotate-12 transition-transform" />
                        <span className="text-sm font-medium text-lavender-950">
                          Profile settings
                        </span>
                      </Link>

                      {/* Option 2: Log Out */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-rose-50 text-rose-500 font-medium text-sm transition-colors group w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-sm font-medium text-rose-500">
                          Log Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-lavender-600 hover:bg-lavender-700 rounded-full shadow-md shadow-lavender-500/20 hover:shadow-lavender-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Animated Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-500 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-5 bg-slate-800 rounded-full transition-all duration-300 ease-in-out origin-center ${
                    mobileMenuOpen
                      ? "rotate-45 translate-y-[7px]"
                      : "rotate-0 translate-y-0"
                  }`}
                />
                <span
                  className={`h-0.5 w-5 bg-slate-800 rounded-full transition-all duration-200 ease-in-out ${
                    mobileMenuOpen
                      ? "opacity-0 scale-x-0"
                      : "opacity-100 scale-x-100"
                  }`}
                />
                <span
                  className={`h-0.5 w-5 bg-slate-800 rounded-full transition-all duration-300 ease-in-out origin-center ${
                    mobileMenuOpen
                      ? "-rotate-45 -translate-y-[7px]"
                      : "rotate-0 translate-y-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Accordion Drawer */}
      <div
        className={`grid md:hidden transition-all duration-300 ease-in-out overflow-hidden border-slate-200 bg-white ${
          mobileMenuOpen
            ? "grid-rows-[1fr] opacity-100 border-b shadow-lg"
            : "grid-rows-[0fr] opacity-0 border-b-0 shadow-none pointer-events-none"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`px-4 pt-2 pb-6 space-y-3 transition-all duration-300 ease-out transform ${
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-3 opacity-0"
            }`}
          >
            {isLoggedIn ? (
              <div className="py-2 space-y-3">
                {/* Greeting & Role in Mobile Drawer */}
                <div className="px-1 pt-1">
                  <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {getGreeting(session.user.fullName, session.user.email)}
                  </h4>
                  {/* <p className="text-xs text-slate-400 font-normal mt-0.5">
                    {getRoleLabel(session.user.role)}
                  </p> */}
                </div>

                <div className="h-px bg-slate-100 my-2" />

                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F4EEFB] hover:bg-lavender-100 text-lavender-900 font-medium text-sm transition-colors"
                  >
                    <Wrench className="w-4 h-4 text-lavender-600 shrink-0" />
                    <span className="text-sm font-medium text-lavender-950">
                      Profile settings
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-500 font-medium text-sm transition-colors text-left w-full"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-sm font-medium text-rose-500">
                      Log Out
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <nav className="flex flex-col space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-base transition-colors ${
                      isHomePage
                        ? "font-semibold text-lavender-700 bg-lavender-50"
                        : "font-medium text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/features"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-base transition-colors ${
                      isFeaturesPage
                        ? "font-semibold text-lavender-700 bg-lavender-50"
                        : "font-medium text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Features
                  </Link>
                  <Link
                    href="/#pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/#about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    About
                  </Link>
                  <a
                    href="#resources"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Resources
                  </a>
                </nav>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 text-sm font-semibold text-white bg-lavender-600 hover:bg-lavender-700 rounded-xl shadow-md shadow-lavender-500/20 active:scale-[0.99] transition-all"
                  >
                    Get Started Free
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
