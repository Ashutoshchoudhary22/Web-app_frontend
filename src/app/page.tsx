import Link from "next/link";
import { AddLinkForm } from "./_components/AddLinkForm";
import { LinksTable } from "./_components/LinksTable";
import { getApiBaseUrl, getShortLinkBaseUrl } from "@/lib/env";
import type { SerializedLink } from "./types";

export const revalidate = 0;

export default async function DashboardPage() {
  const links = await fetchLinks();
  const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0);
  const baseUrl = getShortLinkBaseUrl();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-900/70 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">TinyLink</p>
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          </div>
          <Link
            href="/healthz"
            className="text-sm font-semibold text-slate-400 underline-offset-4 hover:text-indigo-200 hover:underline"
          >
            Healthcheck
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <AddLinkForm baseUrl={baseUrl} />
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/40 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-400">Live stats</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SummaryCard label="Active links" value={links.length.toString()} />
              <SummaryCard label="Total clicks" value={totalClicks.toString()} />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Redirect counts update in real-time as visitors use your short links.
            </p>
          </div>
        </section>

        <LinksTable links={links} baseUrl={baseUrl} />
      </main>

      <footer className="border-t border-slate-900/70 bg-slate-950/80 px-4 py-6 text-center text-xs text-slate-500">
        Built with Next.js, Prisma, and Postgres. Deploy-ready on Vercel + Neon.
      </footer>
    </div>
  );
}

async function fetchLinks(): Promise<SerializedLink[]> {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/links`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to load links from backend");
  }

  return response.json();
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
