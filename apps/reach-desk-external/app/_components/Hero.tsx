"use client";

import React, { useState } from "react";
import { ArrowRight, Play, CheckCircle2, Zap, X } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";

export function Hero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-[#F7F3FD] via-[#FAF7FE] to-white pt-10 pb-16 lg:pt-14 lg:pb-24"
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-lavender-200/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-5 text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lavender-50 border border-lavender-200/80 text-lavender-700 text-xs sm:text-sm font-semibold shadow-xs">
              <Zap className="w-4 h-4 text-lavender-600 fill-lavender-600" />
              <span>Email &amp; WhatsApp Marketing Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Turn Your Contacts <br />
              into{" "}
              <span className="text-lavender-600 relative inline-block">
                Customers
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2 text-lavender-300 -z-10"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  fill="currentColor"
                >
                  <path d="M0,15 Q50,5 100,15 Q50,20 0,15 Z" />
                </svg>
              </span>
            </h1>

            {/* Subheadline description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              Reachdesk helps businesses send email and WhatsApp campaigns with
              ease. Manage your contacts, create beautiful templates, track
              performance — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-lavender-600 hover:bg-lavender-700 active:scale-[0.98] shadow-lg shadow-lavender-500/25 transition-all text-sm sm:text-base group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-lavender-300 shadow-xs transition-all text-sm sm:text-base group"
              >
                <div className="w-6 h-6 rounded-full bg-lavender-50 flex items-center justify-center text-lavender-600 group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-lavender-600 ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Checklist Badges */}
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Set up in minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Secure &amp; compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="lg:col-span-7 pt-4 lg:pt-0">
            <DashboardMockup />
          </div>
        </div>
      </div>

      {/* Watch Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in-50">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Reachdesk Product Walkthrough
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              See how fast you can launch high-converting email and WhatsApp
              campaigns with Reachdesk.
            </p>
            <div className="relative aspect-video rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster="/favicon.ico"
              >
                <source
                  src="/reachdesk_laptop_product_demo_refined.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
