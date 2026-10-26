import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getFaqSchema, siteConfig } from "@/libs/seo";
import {
  Hero,
  Features,
  HowItWorks,
  Testimonials,
  CtaBanner,
} from "./_components";

export const metadata: Metadata = {
  title: "Reachdesk - Email & WhatsApp Marketing Automation Platform",
  description:
    "Turn your contacts into customers. Reachdesk helps modern businesses launch verified WhatsApp campaigns and high-converting emails from one unified workspace.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Reachdesk - Email & WhatsApp Marketing Platform",
    description:
      "Turn your contacts into customers. Send verified WhatsApp campaigns and high-converting emails with ease.",
    url: siteConfig.url,
  },
};

const homeFaqs = [
  {
    question: "What is Reachdesk?",
    answer:
      "Reachdesk is an omnichannel marketing automation platform that empowers businesses to create, manage, and send broadcast email campaigns and Meta-approved WhatsApp messages from a unified workspace.",
  },
  {
    question: "How does WhatsApp marketing work with Reachdesk?",
    answer:
      "Reachdesk integrates with the official Meta WhatsApp Cloud API. You can create pre-approved templates, add interactive buttons, personalize messages with dynamic contact variables, and track delivery and read receipts in real time.",
  },
  {
    question: "Can I manage both email and WhatsApp contacts together?",
    answer:
      "Yes. Reachdesk provides unified audience management with instant CSV/Excel imports, list segmentation, and automated opt-out handling across both email and WhatsApp channels.",
  },
  {
    question: "Is technical coding knowledge required to send campaigns?",
    answer:
      "No technical knowledge is required. Reachdesk features a drag-and-drop template designer, interactive WhatsApp composer, and a simple 4-step campaign launch workflow.",
  },
];

export default function Home() {
  const faqSchema = getFaqSchema(homeFaqs);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-lavender-200 selection:text-lavender-900">
      <JsonLd schema={faqSchema} />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
