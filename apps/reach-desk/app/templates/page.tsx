"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthSession } from "@broteens/features";
import { Sidebar } from "@/components/Sidebar";
import { Spinner } from "@/components/Spinner";
import {
  Menu,
  Plus,
  Search,
  Mail,
  MessageSquare,
  Sparkles,
  Eye,
  Edit3,
  Copy,
  Clock,
  X,
  ChevronRight,
} from "lucide-react";

interface TemplateItem {
  id: string;
  name: string;
  channel: "email" | "whatsapp";
  status: "active" | "draft" | "archived";
  category: string;
  preview: string;
  subject?: string;
  metrics?: {
    sent: string;
    rate: string;
    rateLabel: string;
  };
  updatedAt: string;
}

const INITIAL_TEMPLATES: TemplateItem[] = [
  {
    id: "tpl-1",
    name: "Customer Onboarding & Welcome",
    channel: "email",
    status: "active",
    category: "Lifecycle",
    preview:
      "Hi {{firstName}}, welcome to Reachdesk! We are thrilled to have you on board. Here is how you can launch your first campaign in 2 minutes.",
    subject: "Welcome to Reachdesk! Let's get you set up",
    metrics: { sent: "14.2k", rate: "46.8%", rateLabel: "Open Rate" },
    updatedAt: "2 hours ago",
  },
  {
    id: "tpl-2",
    name: "Instant Order & Shipment Dispatch",
    channel: "whatsapp",
    status: "active",
    category: "Transactional",
    preview:
      "Hello {{customerName}}! Your order #{{orderId}} has been packed and handed over to our courier. Track your live delivery here: {{trackingLink}}",
    metrics: { sent: "28.9k", rate: "98.4%", rateLabel: "Delivered" },
    updatedAt: "Yesterday",
  },
  {
    id: "tpl-3",
    name: "Cart Recovery & Special Discount",
    channel: "email",
    status: "active",
    category: "Promotional",
    preview:
      "Did you forget something? Your selected items are waiting in your cart. Use code SAVE10 for 10% off your checkout.",
    subject: "You left something special behind 👀",
    metrics: { sent: "6.7k", rate: "23.4%", rateLabel: "Conversion" },
    updatedAt: "3 days ago",
  },
  {
    id: "tpl-4",
    name: "Appointment & Booking Reminder",
    channel: "whatsapp",
    status: "active",
    category: "Notification",
    preview:
      "Friendly reminder from {{businessName}}: Your upcoming appointment is scheduled for {{dateTime}}. Reply YES to confirm or RESCHEDULE to pick a new slot.",
    metrics: { sent: "5.1k", rate: "99.1%", rateLabel: "Read Rate" },
    updatedAt: "May 12, 2026",
  },
  {
    id: "tpl-5",
    name: "Summer Product Launch Announcement",
    channel: "email",
    status: "draft",
    category: "Marketing",
    preview:
      "Explore the all-new collection curated specifically for your team. Early bird pricing is live through this weekend.",
    subject: "Introducing our latest collection ✨",
    metrics: { sent: "0", rate: "--", rateLabel: "Draft" },
    updatedAt: "May 10, 2026",
  },
  {
    id: "tpl-6",
    name: "Post-Delivery Feedback & NPS",
    channel: "whatsapp",
    status: "draft",
    category: "Customer Care",
    preview:
      "How was your recent experience with our service? Rate us from 1 to 5 stars to help us improve.",
    metrics: { sent: "0", rate: "--", rateLabel: "Draft" },
    updatedAt: "May 08, 2026",
  },
];

export default function TemplatesPage() {
  const { session } = useAuthSession();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<
    "all" | "email" | "whatsapp"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "draft" | "archived"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "name">("newest");

  // Template creation modal placeholder state
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (mounted && !session) {
      window.location.assign("/login");
    }
  }, [mounted, session]);

  // Filter templates based on search & criteria
  const filteredTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter((tpl) => {
      // Channel match
      if (selectedChannel !== "all" && tpl.channel !== selectedChannel) {
        return false;
      }
      // Status match
      if (selectedStatus !== "all" && tpl.status !== selectedStatus) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(query);
        const matchesPreview = tpl.preview.toLowerCase().includes(query);
        const matchesCategory = tpl.category.toLowerCase().includes(query);
        return matchesName || matchesPreview || matchesCategory;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0; // default keep newest order
    });
  }, [selectedChannel, selectedStatus, searchQuery, sortBy]);

  if (!mounted || !session) {
    return (
      <Spinner
        fullScreen
        size="lg"
        label="Loading workspace..."
        sublabel="Preparing your templates dashboard"
      />
    );
  }

  return (
    <div className="w-full min-h-screen flex bg-slate-50 selection:bg-lavender-200 selection:text-lavender-900">
      {/* ─────────────────────────────────────────────────────────────
          Sidebar (Separate responsive component)
         ───────────────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* ─────────────────────────────────────────────────────────────
          Main Content (Takes full screen width)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col w-full min-h-screen">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Toggle + Breadcrumb */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button - Shown when screen is smaller (< md) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open sidebar menu"
                className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-lavender-600" />
                <span className="text-xs font-semibold">Menu</span>
              </button>

              {/* Breadcrumb / Title */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
                  Workspace
                </span>
                <ChevronRight className="hidden sm:inline-block w-3.5 h-3.5 text-slate-300" />
                <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Templates</span>
                  <span className="text-[11px] font-semibold text-lavender-700 bg-lavender-50 ring-1 ring-lavender-200/80 px-2 py-0.5 rounded-full">
                    {filteredTemplates.length}
                  </span>
                </h1>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-lavender-600 hover:bg-lavender-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-lavender-600/25 hover:shadow-lavender-600/40 transition-all focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden xs:inline">Create Template</span>
                <span className="xs:hidden">New</span>
              </button>

              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                title="Account Settings"
              >
                <div className="w-8 h-8 rounded-full bg-lavender-100 text-lavender-700 text-xs font-bold grid place-items-center uppercase ring-1 ring-lavender-300/60">
                  {session.user.fullName?.slice(0, 2).toUpperCase() || "ME"}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Body Container - Spans Full Width */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner / Overview */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-lavender-900 via-lavender-800 to-lavender-950 text-white p-6 sm:p-8 shadow-sm">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-lavender-200 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-lavender-300" />
                <span>Multi-channel Template Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Design &amp; Publish Campaigns Faster
              </h2>
              <p className="text-sm text-lavender-200/90 leading-relaxed">
                Build compliant Email newsletters and Meta-verified WhatsApp
                templates. Personalize with variables, run previews, and track
                delivery rates all in one place.
              </p>
            </div>

            {/* Decorative background shapes */}
            <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-lavender-600/20 blur-3xl pointer-events-none" />
            <div className="absolute right-24 bottom-0 w-48 h-48 rounded-full bg-lavender-500/20 blur-2xl pointer-events-none" />
          </div>

          {/* Filter, Search & Controls Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Channel Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedChannel("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                    selectedChannel === "all"
                      ? "bg-lavender-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  All Channels
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel("email")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                    selectedChannel === "email"
                      ? "bg-lavender-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedChannel("whatsapp")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                    selectedChannel === "whatsapp"
                      ? "bg-lavender-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Search and Sort controls */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Search Field */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lavender-500/20 focus:border-lavender-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value as "all" | "active" | "draft" | "archived",
                    )
                  }
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-lavender-500/20 focus:border-lavender-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "name")
                  }
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-lavender-500/20 focus:border-lavender-500"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="name">Sort: Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Templates Grid / Cards */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map((template) => {
                const isEmail = template.channel === "email";
                const isActive = template.status === "active";

                return (
                  <div
                    key={template.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-lavender-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Channel Badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isEmail
                              ? "bg-lavender-50 text-lavender-700 ring-1 ring-lavender-200"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          }`}
                        >
                          {isEmail ? (
                            <Mail className="w-3.5 h-3.5" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5" />
                          )}
                          <span className="capitalize">{template.channel}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            <span className="capitalize">
                              {template.status}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Title & Category */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                          {template.category}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-lavender-700 transition-colors mt-0.5 line-clamp-1">
                          {template.name}
                        </h3>
                      </div>

                      {/* Subject or Preview snippet */}
                      {template.subject && (
                        <p className="text-xs font-medium text-slate-700 line-clamp-1">
                          <span className="text-slate-400">Subject: </span>
                          {template.subject}
                        </p>
                      )}

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 font-mono leading-relaxed line-clamp-3">
                        {template.preview}
                      </div>

                      {/* Metrics bar */}
                      {template.metrics && (
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-400">
                              Dispatched:
                            </span>
                            <p className="font-bold text-slate-800">
                              {template.metrics.sent}
                            </p>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400">
                              {template.metrics.rateLabel}:
                            </span>
                            <p className="font-bold text-lavender-700">
                              {template.metrics.rate}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.updatedAt}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          title="Preview Template"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-lavender-700 hover:bg-lavender-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Edit Template"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-lavender-700 hover:bg-lavender-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Duplicate"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-lavender-700 hover:bg-lavender-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-lavender-50 text-lavender-600 grid place-items-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  No templates found
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria or filter options to locate
                  the templates you need.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedChannel("all");
                  setSelectedStatus("all");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-lavender-700 bg-lavender-50 hover:bg-lavender-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Placeholder Creation Dialog (ready for subsequent tasks)
         ───────────────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lavender-700 font-bold">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900">
                  New Campaign Template
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Select the communication channel you wish to design a template
              for:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-lavender-600 hover:bg-lavender-50/50 transition-all text-left space-y-2 group"
              >
                <Mail className="w-6 h-6 text-lavender-600 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-slate-900">Email</div>
                <div className="text-[11px] text-slate-500">
                  HTML &amp; drag-and-drop newsletter templates
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-left space-y-2 group"
              >
                <MessageSquare className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-slate-900">WhatsApp</div>
                <div className="text-[11px] text-slate-500">
                  Meta-approved transactional &amp; marketing messages
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
