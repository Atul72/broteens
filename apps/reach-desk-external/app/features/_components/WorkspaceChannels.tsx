"use client";

import React from "react";
import {
  Mail,
  MessageSquare,
  Users,
  CheckCheck,
  MessageCircle,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export function WorkspaceChannels() {
  const cards = [
    {
      title: "Email campaigns",
      description:
        "Create beautiful email campaigns and reach the right audience at the right time.",
      icon: Mail,
      href: "#email",
    },
    {
      title: "WhatsApp outreach",
      description:
        "Start personal conversations with timely, helpful WhatsApp messages.",
      icon: MessageSquare,
      href: "#whatsapp",
    },
    {
      title: "Contact management",
      description:
        "Keep contacts organized with tags, segments, and clean audience lists.",
      icon: Users,
      href: "#contacts",
    },
    {
      title: "Ready-to-use templates",
      description:
        "Move faster with polished templates for launches, offers, and follow-ups.",
      icon: CheckCheck,
      href: "#templates",
    },
    {
      title: "Reply tracking",
      description:
        "Bring replies into one view so no valuable conversation gets missed.",
      icon: MessageCircle,
      href: "#replies",
    },
    {
      title: "Campaign analytics",
      description:
        "Understand opens, clicks, replies, and conversions at a glance.",
      icon: BarChart3,
      href: "#analytics",
    },
  ];

  return (
    <section id="channels" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One workspace. Every channel.
          </h2>
          <p className="mt-2 text-base text-slate-500">
            Everything you need to plan smarter campaigns and build lasting
            customer relationships.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-lavender-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-lavender-50 text-lavender-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-lavender-100 transition-all">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2.5">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Learn More link */}
                <div className="pt-6">
                  <a
                    href={card.href}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-lavender-600 hover:text-lavender-800 transition-colors group/link"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
