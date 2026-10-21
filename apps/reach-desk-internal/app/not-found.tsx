import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ReachdeskLogo } from "@/components/ReachdeskLogo";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Reachdesk Workspace",
  description: "The page you are looking for is not found.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 selection:bg-lavender-200 selection:text-lavender-900">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center space-y-5">
        <div className="flex justify-center">
          <ReachdeskLogo iconClassName="w-10 h-10 text-lavender-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The workspace page or template you are looking for does not exist or
            may have been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-lavender-600 hover:bg-lavender-700 shadow-sm transition-all text-sm w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Templates</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
