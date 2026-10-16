"use client";

import React from "react";

export function FeaturesCtaBanner() {
  return (
    <section className="py-8 sm:py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-lavender-700 text-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-lavender-600/20">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <span className="block text-xs font-bold text-lavender-200 tracking-wider uppercase mb-1.5">
                Ready to make every message count?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Turn outreach into real conversations.
              </h3>
              <p className="mt-1.5 text-sm sm:text-base text-lavender-100 max-w-xl leading-relaxed">
                Bring your email and WhatsApp campaigns together with Reachdesk.
              </p>
            </div>

            {/* Right Action Button & Subtext (Centered together) */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <a
                href="#start"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-semibold text-white bg-lavender-500 hover:bg-lavender-400 active:scale-[0.98] shadow-md shadow-lavender-950/25 transition-all text-center"
              >
                Get started free
              </a>
              <span className="text-[11px] text-lavender-200 mt-2 text-center block whitespace-nowrap">
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
