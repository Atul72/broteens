"use client";

import React from "react";

export function WorkflowSteps() {
  const steps = [
    {
      num: "01",
      title: "Bring your audience",
      description: "Import contacts, add tags, and build focused segments.",
    },
    {
      num: "02",
      title: "Create your campaign",
      description: "Choose a channel, customize a template, and schedule.",
    },
    {
      num: "03",
      title: "Learn and improve",
      description: "Track engagement, follow up on replies, and optimize.",
    },
  ];

  return (
    <section className="pt-12 pb-14 sm:pt-16 sm:pb-16 bg-[#FAF8FE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            From first touch to real connection
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            A simple workflow keeps your team focused on the conversations that
            matter.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-lavender-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Number Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-lavender-100/80 text-lavender-700 text-xs font-bold font-mono mb-4">
                  {step.num}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
