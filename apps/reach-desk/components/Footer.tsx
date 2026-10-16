"use client";

import React from "react";
import Link from "next/link";
import { ReachdeskLogo } from "./ReachdeskLogo";

export function Footer() {
  return (
    <footer className="relative z-10 bg-white border-t border-slate-200/80 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ReachdeskLogo iconClassName="w-7 h-7 text-lavender-600" />
          </Link>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600">
            <Link
              href="/"
              className="hover:text-lavender-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="hover:text-lavender-600 transition-colors"
            >
              Features
            </Link>
            <a
              href="#pricing"
              className="hover:text-lavender-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="hover:text-lavender-600 transition-colors"
            >
              About
            </a>
            <a
              href="#resources"
              className="hover:text-lavender-600 transition-colors"
            >
              Resources
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-3 text-slate-500">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-lavender-50 hover:text-lavender-600 border border-slate-200/60 flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-lavender-50 hover:text-lavender-600 border border-slate-200/60 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-lavender-50 hover:text-lavender-600 border border-slate-200/60 flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-lavender-50 hover:text-lavender-600 border border-slate-200/60 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Reachdesk. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </a>
            <a
              href="#privacy"
              className="hover:text-slate-800 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#messaging-policy"
              className="hover:text-slate-800 transition-colors"
            >
              Messaging Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
