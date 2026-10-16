import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Hero,
  Features,
  HowItWorks,
  Testimonials,
  CtaBanner,
} from "./_components";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-lavender-200 selection:text-lavender-900">
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
