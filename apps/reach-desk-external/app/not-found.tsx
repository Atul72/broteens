import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Reachdesk",
  description:
    "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-lavender-200 selection:text-lavender-900">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-gradient-to-b from-[#FAF7FE] via-white to-white">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* 3D Navigator Illustration */}
          <div className="w-full max-w-[460px] sm:max-w-[540px] mx-auto mb-6 relative select-none">
            <Image
              src="/404-illustration.png"
              alt="404 Page Not Found"
              width={1624}
              height={969}
              priority
              className="w-full h-auto drop-shadow-sm object-contain"
            />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Page not found
          </h1>

          {/* Description */}
          <p className="mt-3.5 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-lavender-600 hover:bg-lavender-700 active:scale-[0.98] shadow-lg shadow-lavender-600/25 transition-all text-sm group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Go back home</span>
            </Link>

            {/* Secondary Action Link */}
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-lavender-600 hover:text-lavender-700 transition-colors inline-flex items-center gap-1.5 group pt-1"
            >
              <span>Or explore our dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
