"use client";

import React from "react";
import {
  Mail,
  MessageCircle,
  Users,
  LayoutTemplate,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Email Campaigns",
      description:
        "Create beautiful emails, automate follow-ups, and track performance.",
      icon: Mail,
      iconBg: "bg-lavender-100 text-lavender-600",
      borderHover: "hover:border-lavender-300",
    },
    {
      title: "WhatsApp Campaigns",
      description:
        "Send approved messages with high open rates and engagement.",
      icon: MessageCircle,
      iconBg: "bg-emerald-100 text-emerald-600",
      borderHover: "hover:border-emerald-300",
    },
    {
      title: "Contact Management",
      description: "Import, segment, and manage your audience with ease.",
      icon: Users,
      iconBg: "bg-purple-100 text-purple-600",
      borderHover: "hover:border-purple-300",
    },
    {
      title: "Ready Templates",
      description: "Use professional templates or create your own.",
      icon: LayoutTemplate,
      iconBg: "bg-sky-100 text-sky-600",
      borderHover: "hover:border-sky-300",
    },
    {
      title: "Real-time Analytics",
      description: "Track opens, clicks, replies and campaign ROI.",
      icon: BarChart3,
      iconBg: "bg-amber-100 text-amber-600",
      borderHover: "hover:border-amber-300",
    },
    {
      title: "Secure & Compliant",
      description: "Built with privacy and data protection in mind.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-100 text-emerald-600",
      borderHover: "hover:border-emerald-300",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Grow
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Powerful features to help you reach, engage, and convert your
            audience.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ${feature.borderHover}`}
              >
                {/* Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feature.iconBg} shadow-xs group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
