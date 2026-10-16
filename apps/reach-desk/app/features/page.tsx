import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FeaturesHero,
  WorkspaceChannels,
  WorkflowSteps,
  FeaturesCtaBanner,
} from "./_components";

export const metadata: Metadata = {
  title: "Features - Reachdesk | Email & WhatsApp Marketing Platform",
  description:
    "Explore the Reachdesk platform. Every conversation, closer to conversion. One workspace for email campaigns, WhatsApp outreach, contact management, and analytics.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-lavender-200 selection:text-lavender-900">
      <Navbar />
      <main className="flex-1">
        {/* Features Hero Section */}
        <FeaturesHero />

        {/* One Workspace. Every Channel. (6 Features Grid) */}
        <WorkspaceChannels />

        {/* From First Touch to Real Connection (3 Workflow Steps) */}
        <WorkflowSteps />

        {/* Bottom Features CTA Banner */}
        <FeaturesCtaBanner />
      </main>
      <Footer />
    </div>
  );
}
