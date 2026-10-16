"use client";

import React from "react";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";

export function FeaturesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3FD] via-[#FAF7FE] to-white pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-lavender-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Badge matching Home page */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lavender-50 border border-lavender-200/80 text-lavender-700 text-xs sm:text-sm font-semibold shadow-xs">
              <Zap className="w-4 h-4 text-lavender-600 fill-lavender-600" />
              <span>Platform Features</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Every conversation, <br />
              closer to conversion.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              Launch email and WhatsApp campaigns, organize your audience, and
              see what turns outreach into real relationships.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#start"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-lavender-600 hover:bg-lavender-700 shadow-md shadow-lavender-500/25 transition-all"
              >
                Explore the platform
              </a>

              <a
                href="#channels"
                className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-lavender-700 hover:text-lavender-800 transition-colors group"
              >
                <span>See how it works</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Campaign Overview SaaS Card */}
          <div className="lg:col-span-6">
            <div className="w-full max-w-lg ml-auto bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xl shadow-lavender-500/10">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">
                  Campaign overview
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-3 my-5">
                {/* Metric 1 */}
                <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    Messages sent
                  </div>
                  <div className="text-base sm:text-xl font-bold text-slate-900 mt-1">
                    24,680
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>12.8%</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    Reply rate
                  </div>
                  <div className="text-base sm:text-xl font-bold text-slate-900 mt-1">
                    18.4%
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>4.2%</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    Conversions
                  </div>
                  <div className="text-base sm:text-xl font-bold text-slate-900 mt-1">
                    1,284
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>8.6%</span>
                  </div>
                </div>
              </div>

              {/* Chart: Campaign Performance */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-800 mb-2">
                  Campaign performance
                </div>

                {/* SVG Performance Curve */}
                <div className="relative w-full h-28 pt-2">
                  <svg
                    viewBox="0 0 350 90"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="featuresChartGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8646D8"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#8646D8"
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Subtle Grid Lines */}
                    <line
                      x1="0"
                      y1="20"
                      x2="350"
                      y2="20"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="50"
                      x2="350"
                      y2="50"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="80"
                      x2="350"
                      y2="80"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />

                    {/* Gradient fill */}
                    <path
                      d="M 10 75 L 50 68 L 80 72 L 115 50 L 150 56 L 190 38 L 225 45 L 265 26 L 305 34 L 345 16 L 345 80 L 10 80 Z"
                      fill="url(#featuresChartGrad)"
                    />

                    {/* Curve line */}
                    <path
                      d="M 10 75 L 50 68 L 80 72 L 115 50 L 150 56 L 190 38 L 225 45 L 265 26 L 305 34 L 345 16"
                      fill="none"
                      stroke="#8646D8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Key Data Point Dots */}
                    <circle
                      cx="115"
                      cy="50"
                      r="3"
                      fill="#ffffff"
                      stroke="#8646D8"
                      strokeWidth="2"
                    />
                    <circle
                      cx="265"
                      cy="26"
                      r="3"
                      fill="#ffffff"
                      stroke="#8646D8"
                      strokeWidth="2"
                    />
                    <circle cx="345" cy="16" r="3.5" fill="#8646D8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
