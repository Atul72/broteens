"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Send,
  FileCode2,
  BarChart3,
  Boxes,
  Settings,
  MessageCircle,
  Mail,
  CheckCheck,
  Sparkles,
} from "lucide-react";

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeChannel, setActiveChannel] = useState<
    "all" | "email" | "whatsapp"
  >("all");

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Soft Ambient Lavender Glow Behind Mockup */}
      <div className="absolute -inset-4 bg-gradient-to-r from-lavender-400/20 via-purple-300/20 to-lavender-500/20 rounded-3xl blur-2xl -z-10 opacity-70 transform -rotate-1 pointer-events-none" />

      {/* Main SaaS Window Frame */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-lavender-glow/40">
        {/* Top Browser / Window Header */}
        <div className="h-8 bg-slate-100/90 border-b border-slate-200/70 px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          </div>
          <div className="bg-white/80 border border-slate-200/60 rounded-md px-3 py-0.5 text-[11px] text-slate-500 font-medium tracking-tight flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            app.reachdesk.io/dashboard
          </div>
          <div className="w-10" />
        </div>

        {/* Dashboard Workspace Grid */}
        <div className="flex min-h-[460px] sm:min-h-[500px]">
          {/* Left Mini Sidebar (Slate 900) - Desktop only for clean mobile fit */}
          <aside className="hidden sm:flex sm:w-44 bg-[#141724] text-slate-300 p-2.5 sm:p-4 flex-col justify-between shrink-0 select-none border-r border-slate-800">
            <div>
              {/* Mini Brand Logo */}
              <div className="flex items-center gap-2 mb-6 px-1">
                <div className="w-7 h-7 rounded-lg bg-lavender-600/20 flex items-center justify-center text-lavender-400 shrink-0">
                  <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4">
                    <path
                      d="M3.5 15.5L28.5 4.5L17.5 19L3.5 15.5Z"
                      fill="currentColor"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M17.5 19L28.5 4.5L14.5 28L12.5 20.5L17.5 19Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="hidden sm:inline font-bold text-white text-sm tracking-tight">
                  Reachdesk
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {[
                  { name: "Dashboard", icon: LayoutDashboard },
                  { name: "Contacts", icon: Users },
                  { name: "Campaigns", icon: Send },
                  { name: "Templates", icon: FileCode2 },
                  { name: "Analytics", icon: BarChart3 },
                  { name: "Integrations", icon: Boxes },
                  { name: "Settings", icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-lavender-600 text-white shadow-sm shadow-lavender-600/40"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                      title={item.name}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom mini status */}
            <div className="hidden sm:block pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Free Plan</span>
                <span className="text-lavender-400 font-semibold cursor-pointer hover:underline">
                  Upgrade
                </span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-[#F9FAFC] p-3 sm:p-5 flex flex-col justify-between overflow-x-hidden">
            {/* Top Bar: Greetings & User Profile */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Good morning, Sarah!
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Here&apos;s what&apos;s happening with your campaigns today.
                </p>
              </div>

              {/* User Profile Chip */}
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-lavender-500 to-purple-400 flex items-center justify-center text-white text-[10px] font-bold">
                  SJ
                </div>
                <div className="hidden sm:block text-left text-[11px] leading-tight">
                  <div className="font-semibold text-slate-800">
                    Sarah Johnson
                  </div>
                  <div className="text-[10px] text-slate-400">Acme Corp</div>
                </div>
              </div>
            </div>

            {/* 4 Stat Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 my-3">
              {/* Card 1 */}
              <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  Total Contacts
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm sm:text-lg font-bold text-slate-900">
                    12,548
                  </span>
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    +12%
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  Campaigns Sent
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm sm:text-lg font-bold text-slate-900">
                    24
                  </span>
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    +4%
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  Delivery Rate
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm sm:text-lg font-bold text-slate-900">
                    98.4%
                  </span>
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    +2%
                  </span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  Total Revenue
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm sm:text-lg font-bold text-slate-900">
                    ₹1,24,500
                  </span>
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    +8%
                  </span>
                </div>
              </div>
            </div>

            {/* Split Section: Campaign Performance Chart + Recent Campaigns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-1">
              {/* Campaign Performance Chart (7 cols on desktop) */}
              <div className="md:col-span-7 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    Campaign Performance
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <button
                      onClick={() =>
                        setActiveChannel(
                          activeChannel === "email" ? "all" : "email",
                        )
                      }
                      className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
                        activeChannel === "whatsapp"
                          ? "opacity-40"
                          : "opacity-100"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-lavender-600 inline-block" />
                      <span className="text-slate-600 font-medium">Email</span>
                    </button>
                    <button
                      onClick={() =>
                        setActiveChannel(
                          activeChannel === "whatsapp" ? "all" : "whatsapp",
                        )
                      }
                      className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
                        activeChannel === "email" ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-slate-600 font-medium">
                        WhatsApp
                      </span>
                    </button>
                  </div>
                </div>

                {/* SVG Curve Line Graph with Lavender & Emerald Series */}
                <div className="relative w-full h-32 sm:h-36 pt-2">
                  <svg
                    viewBox="0 0 400 130"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="lavenderGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8646D8"
                          stopOpacity="0.28"
                        />
                        <stop
                          offset="100%"
                          stopColor="#8646D8"
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                      <linearGradient
                        id="emeraldGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10B981"
                          stopOpacity="0.22"
                        />
                        <stop
                          offset="100%"
                          stopColor="#10B981"
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Reference Lines */}
                    <line
                      x1="0"
                      y1="20"
                      x2="400"
                      y2="20"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="0"
                      y1="50"
                      x2="400"
                      y2="50"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="0"
                      y1="80"
                      x2="400"
                      y2="80"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="0"
                      y1="110"
                      x2="400"
                      y2="110"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />

                    {/* Lavender Area + Path (Email) */}
                    {(activeChannel === "all" || activeChannel === "email") && (
                      <>
                        <path
                          d="M 10 95 C 60 70, 110 85, 160 55 C 210 25, 270 65, 320 30 C 350 15, 380 25, 395 18 L 395 110 L 10 110 Z"
                          fill="url(#lavenderGrad)"
                        />
                        <path
                          d="M 10 95 C 60 70, 110 85, 160 55 C 210 25, 270 65, 320 30 C 350 15, 380 25, 395 18"
                          fill="none"
                          stroke="#8646D8"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="160"
                          cy="55"
                          r="3.5"
                          fill="#ffffff"
                          stroke="#8646D8"
                          strokeWidth="2"
                        />
                        <circle
                          cx="320"
                          cy="30"
                          r="3.5"
                          fill="#ffffff"
                          stroke="#8646D8"
                          strokeWidth="2"
                        />
                      </>
                    )}

                    {/* Emerald Area + Path (WhatsApp) */}
                    {(activeChannel === "all" ||
                      activeChannel === "whatsapp") && (
                      <>
                        <path
                          d="M 10 105 C 70 95, 120 70, 170 78 C 220 86, 280 40, 330 48 C 360 52, 380 32, 395 28 L 395 110 L 10 110 Z"
                          fill="url(#emeraldGrad)"
                        />
                        <path
                          d="M 10 105 C 70 95, 120 70, 170 78 C 220 86, 280 40, 330 48 C 360 52, 380 32, 395 28"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="170"
                          cy="78"
                          r="3"
                          fill="#ffffff"
                          stroke="#10B981"
                          strokeWidth="2"
                        />
                        <circle
                          cx="395"
                          cy="28"
                          r="3"
                          fill="#ffffff"
                          stroke="#10B981"
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </svg>

                  {/* Dates X-Axis */}
                  <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-400 mt-1 px-1">
                    <span>Apr 12</span>
                    <span>Apr 14</span>
                    <span>Apr 16</span>
                    <span>Apr 18</span>
                    <span>Apr 20</span>
                    <span>Apr 22</span>
                  </div>
                </div>
              </div>

              {/* Recent Campaigns (5 cols on desktop) */}
              <div className="md:col-span-5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-800 mb-2">
                  Recent Campaigns
                </span>
                <div className="space-y-2">
                  {[
                    {
                      title: "Summer Sale - Email",
                      date: "Apr 22, 2026",
                      type: "Email",
                      status: "Delivered",
                      badgeClass:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    },
                    {
                      title: "Welcome Message",
                      date: "Apr 20, 2026",
                      type: "WhatsApp",
                      status: "Delivered",
                      badgeClass:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    },
                    {
                      title: "Product Update",
                      date: "Apr 18, 2026",
                      type: "Email",
                      status: "Delivered",
                      badgeClass:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    },
                    {
                      title: "Re-engagement",
                      date: "Apr 16, 2026",
                      type: "WhatsApp",
                      status: "In Progress",
                      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
                    },
                  ].map((camp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            camp.type === "Email"
                              ? "bg-lavender-100 text-lavender-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {camp.type === "Email" ? (
                            <Mail className="w-3 h-3" />
                          ) : (
                            <MessageCircle className="w-3 h-3" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-semibold text-slate-800 truncate max-w-[110px] sm:max-w-[140px]">
                            {camp.title}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            {camp.date}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${camp.badgeClass}`}
                      >
                        {camp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Card 1: WhatsApp Conversation Bubble (Top Right) */}
      <div className="hidden sm:block absolute -top-5 -right-3 md:-top-7 md:-right-6 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden transform hover:-translate-y-1 transition-transform duration-200 z-10">
        {/* WhatsApp Green Top Header */}
        <div className="bg-[#075E54] text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold">
              RD
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight flex items-center gap-1">
                Business{" "}
                <span className="text-[10px] bg-emerald-400 text-slate-900 rounded-full px-1">
                  ✓
                </span>
              </div>
              <div className="text-[9px] text-emerald-200">Online</div>
            </div>
          </div>
          <MessageCircle className="w-4 h-4 text-emerald-300" />
        </div>
        {/* Chat message content */}
        <div className="p-3 bg-[#EFEAE2]">
          <div className="bg-white p-2.5 rounded-xl rounded-tl-none shadow-xs text-[11px] text-slate-800 leading-snug">
            <p className="font-medium">Hello! 👋</p>
            <p className="mt-1 text-slate-600">
              Check out our latest offers and special discounts just for you.
            </p>
            <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">
              <span>10:24 AM</span>
              <CheckCheck className="w-3 h-3 text-lavender-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card 2: Special Offer Card (Bottom Right) */}
      <div className="hidden sm:block absolute -bottom-6 -right-2 md:-bottom-8 md:right-4 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-3.5 transform hover:-translate-y-1 transition-transform duration-200 z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </span>
          <span className="text-xs font-bold text-slate-900">
            Special Offer Just for You!
          </span>
        </div>
        <div className="text-[10px] text-slate-400 mb-2">
          Acme Corp • hello@acme.com
        </div>
        <p className="text-[11px] text-slate-600 leading-snug mb-3">
          Hey there, We&apos;re excited to share our latest collection with you.
          Enjoy exclusive discounts and limited-time offers.
        </p>
        <button
          type="button"
          className="w-full py-1.5 px-3 bg-lavender-600 hover:bg-lavender-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-lavender-500/30 transition-colors"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}
