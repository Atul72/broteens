"use client";

import React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Marketing Head, SpiceRoute",
      quote:
        "“Reachdesk has made our marketing so much simpler. We get better engagement and more customers every month.”",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Rohit Mehta",
      role: "Owner, Urban Bites",
      quote:
        "“The WhatsApp integration is a game-changer. Our response rate has increased by 3x!”",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Ananya Kapoor",
      role: "Founder, The Wellness Co.",
      quote:
        "“Easy to use, great support, and powerful features. Totally recommended!”",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Businesses Across India
          </h2>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-lavender-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* User Info Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-lavender-100 shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-600 leading-relaxed italic mb-5">
                  {item.quote}
                </p>
              </div>

              {/* 5 Stars Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
