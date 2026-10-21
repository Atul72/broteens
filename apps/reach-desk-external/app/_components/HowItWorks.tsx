"use client";

import React, { useState } from "react";
import { ArrowRight, UploadCloud, FileSpreadsheet, Check } from "lucide-react";
import { CustomDropdown } from "@/components/CustomDropdown";

export function HowItWorks() {
  const [selectedChannel, setSelectedChannel] = useState<
    "both" | "email" | "whatsapp"
  >("both");
  const [selectedTemplate, setSelectedTemplate] = useState("Welcome Email");
  const [selectedAudience, setSelectedAudience] = useState(
    "All Contacts (12,548)",
  );
  const [scheduleTime, setScheduleTime] = useState("Send Now");
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setLaunchSuccess(true);
      setTimeout(() => setLaunchSuccess(false), 3000);
    }, 800);
  };

  const steps = [
    {
      number: "1",
      title: "Create Account",
      description: "Sign up and set up your workspace.",
    },
    {
      number: "2",
      title: "Upload Contacts",
      description: "Import your contact list (CSV or Excel).",
    },
    {
      number: "3",
      title: "Choose Template",
      description: "Select or create your message template.",
    },
    {
      number: "4",
      title: "Send Campaign",
      description: "Launch and track your results.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, 4-Step Stepper, and CTA */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              {/* Badge */}
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-lavender-100 text-lavender-700 text-xs font-bold tracking-wide uppercase mb-3">
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Launch Your First Campaign <br className="hidden sm:inline" />
                in 4 Simple Steps
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Get started in minutes and reach your audience through email and
                WhatsApp — no technical skills required.
              </p>
            </div>

            {/* Stepper with Connected Line/Arrows */}
            <div className="space-y-6">
              {/* Desktop Horizontal Stepper */}
              <div className="hidden sm:grid grid-cols-4 gap-2 relative">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col items-start pr-2 group"
                  >
                    <div className="flex items-center w-full mb-3">
                      <div className="w-9 h-9 rounded-full bg-lavender-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-lavender-500/25 shrink-0 group-hover:scale-110 transition-transform">
                        {step.number}
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="flex-1 h-0.5 bg-lavender-200 mx-2 flex items-center justify-end">
                          <ArrowRight className="w-3.5 h-3.5 text-lavender-400 -mr-1" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile Vertical Stepper */}
              <div className="sm:hidden space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-lavender-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-lavender-500/20 shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <a
                href="#start"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-lavender-600 hover:bg-lavender-700 active:scale-[0.98] shadow-lg shadow-lavender-500/25 transition-all text-sm group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Mockup Cards (Import Contacts + Campaign Builder) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Import Contacts */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase mb-3 text-slate-400">
                  Import Contacts
                </h4>

                {/* Drag and Drop Box */}
                <div className="border-2 border-dashed border-lavender-200 hover:border-lavender-400 rounded-xl p-5 text-center bg-lavender-50/30 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Drag &amp; drop your file here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    or click to upload
                  </p>
                  <span className="inline-block mt-2 text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                    Supported: CSV, XLSX
                  </span>
                </div>
              </div>

              {/* Uploaded File Chip */}
              <div className="mt-4 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-800">
                      contacts.csv
                    </div>
                    <div className="text-[10px] text-slate-400">2.4 MB</div>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Card 2: Campaign Builder */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 tracking-tight uppercase mb-3 text-slate-400">
                  Campaign Builder
                </h4>

                <div className="space-y-3">
                  {/* Step 1: Select Channel */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-lavender-100 text-lavender-700 flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>Select Channel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedChannel(
                            selectedChannel === "email" ? "both" : "email",
                          )
                        }
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                          selectedChannel === "email" ||
                          selectedChannel === "both"
                            ? "bg-lavender-50 border-lavender-300 text-lavender-800"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-lavender-600" />
                        <span>Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedChannel(
                            selectedChannel === "whatsapp"
                              ? "both"
                              : "whatsapp",
                          )
                        }
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                          selectedChannel === "whatsapp" ||
                          selectedChannel === "both"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Choose Template */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                      <span className="w-4 h-4 rounded-full bg-lavender-100 text-lavender-700 flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>Choose Template</span>
                    </div>
                    <CustomDropdown
                      value={selectedTemplate}
                      onChange={setSelectedTemplate}
                      options={[
                        "Welcome Email",
                        "Product Discount Promo",
                        "Event Announcement",
                        "Customer Feedback",
                      ]}
                    />
                  </div>

                  {/* Step 3: Select Audience */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                      <span className="w-4 h-4 rounded-full bg-lavender-100 text-lavender-700 flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>Select Audience</span>
                    </div>
                    <CustomDropdown
                      value={selectedAudience}
                      onChange={setSelectedAudience}
                      options={[
                        "All Contacts (12,548)",
                        "Active Shoppers (4,820)",
                        "New Signups (1,410)",
                        "VIP Clients (320)",
                      ]}
                    />
                  </div>

                  {/* Step 4: Schedule */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                      <span className="w-4 h-4 rounded-full bg-lavender-100 text-lavender-700 flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>Schedule</span>
                    </div>
                    <CustomDropdown
                      value={scheduleTime}
                      onChange={setScheduleTime}
                      options={[
                        "Send Now",
                        "Schedule for Tomorrow 9:00 AM",
                        "Schedule for Weekend",
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isLaunching}
                className="w-full py-2.5 px-3 bg-lavender-600 hover:bg-lavender-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-lavender-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isLaunching ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Launching...
                  </span>
                ) : launchSuccess ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-100">
                    <Check className="w-3.5 h-3.5 text-white" />
                    Campaign Launched!
                  </span>
                ) : (
                  <span>Review &amp; Launch</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
