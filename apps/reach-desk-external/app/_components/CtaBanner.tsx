"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-8 sm:py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-lavender-600 via-purple-600 to-indigo-700 text-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-lavender-600/20">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-lavender-400/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Left: Icon & Text */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
              {/* Paper Plane Icon in Translucent White Circle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-white drop-shadow"
                >
                  <path
                    d="M3.5 15.5L28.5 4.5L17.5 19L3.5 15.5Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M17.5 19L28.5 4.5L14.5 28L12.5 20.5L17.5 19Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Ready to Grow Your Business?
                </h3>
                <p className="mt-1.5 text-sm sm:text-base text-lavender-100 max-w-xl leading-relaxed">
                  Join thousands of businesses already using Reachdesk to send
                  better campaigns and get real results.
                </p>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="w-full sm:w-auto shrink-0">
              <a
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-lavender-700 bg-white hover:bg-slate-50 active:scale-[0.98] shadow-lg shadow-black/10 transition-all text-sm sm:text-base group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-lavender-700 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
