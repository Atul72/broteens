import type { ReactNode } from "react";

export interface AuthShellProps {
  children: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
}

export function AuthShell({
  children,
  description,
  eyebrow = "Broteens alerts",
  title,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-300/60 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
          <a
            href="/"
            className="relative flex items-center gap-3 font-semibold tracking-tight"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-slate-950">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 17h16M6 14l3-3 3 2 5-6 2 2" />
              </svg>
            </span>
            Broteens
          </a>

          <div className="relative max-w-lg space-y-6">
            <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              Smarter shopping starts here
            </span>
            <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em]">
              Never miss the moment a price drops.
            </h2>
            <p className="max-w-md text-base leading-7 text-slate-300">
              Track products across your favourite stores and get a clear alert
              when it is finally time to buy.
            </p>
          </div>

          <p className="relative text-xs text-slate-500">
            Simple alerts. Better decisions.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <a
                href="/"
                className="inline-flex items-center gap-2 font-semibold text-slate-950"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400">
                  B
                </span>
                Broteens
              </a>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
