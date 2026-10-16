"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthSession } from "@broteens/features";
import { ReachdeskLogo } from "./ReachdeskLogo";
import { ChevronDown } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { session } = useAuthSession();
  const pathname = usePathname();

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
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-500 rounded-lg"
          >
            <ReachdeskLogo iconClassName="w-8 h-8 text-lavender-600" />
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && session ? (
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-lavender-50 text-slate-800 transition-colors border border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-lavender-600 text-white font-bold text-xs grid place-items-center uppercase shadow-sm">
                  {session.user.fullName
                    ? session.user.fullName.slice(0, 2)
                    : session.user.email.slice(0, 2)}
                </div>
                <span className="text-sm font-semibold text-slate-800 max-w-[120px] truncate">
                  {session.user.fullName || "Settings"}
                </span>
              </Link>
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

          {/* Animated Mobile Menu Button (Hamburger to X) */}
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

      {/* Smooth Animated Mobile Menu Accordion Drawer */}
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
              {mounted && session ? (
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-lavender-700 bg-lavender-50 hover:bg-lavender-100 rounded-xl border border-lavender-200 transition-colors"
                >
                  Workspace Settings (
                  {session.user.fullName || session.user.email})
                </Link>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
