import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getBreadcrumbSchema, siteConfig } from "@/libs/seo";
import {
  FeaturesHero,
  WorkspaceChannels,
  WorkflowSteps,
  FeaturesCtaBanner,
} from "./_components";

export const metadata: Metadata = {
  title: "Features - Email & WhatsApp Marketing Tools",
  description:
    "Explore the Reachdesk platform. One workspace for Meta-approved WhatsApp templates, email broadcast campaigns, audience segmentation, real-time analytics, and automated compliance.",
  keywords: [
    "WhatsApp Marketing Features",
    "Email Campaign Tools",
    "WhatsApp Template Builder",
    "WhatsApp Business API",
    "Audience Segmentation",
    "Delivery Tracking Analytics",
    "Automated Opt-Out Compliance",
  ],
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Features - Reachdesk Email & WhatsApp Marketing Platform",
    description:
      "One unified workspace for Meta-approved WhatsApp outreach, email broadcast campaigns, contact management, and delivery analytics.",
    url: `${siteConfig.url}/features`,
  },
};

export default function FeaturesPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Features", url: "/features" },
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-lavender-200 selection:text-lavender-900">
      <JsonLd schema={breadcrumbSchema} />
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
