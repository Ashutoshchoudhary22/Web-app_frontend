import Link from "next/link";
import { notFound } from "next/navigation";
import { codeRegex } from "@/lib/validation";
import { formatDate } from "@/lib/format";
import { CopyButton } from "@/app/_components/CopyButton";
import { getApiBaseUrl, getShortLinkBaseUrl } from "@/lib/env";
import type { SerializedLink } from "@/app/types";

type Params = {
  params: Promise<{ code: string }>;
};

export default async function CodeStatsPage({ params }: Params) {
  const { code } = await params;

  if (!codeRegex.test(code)) {
    notFound();
  }

  const link = await fetchLink(code);
  if (!link) {
    notFound();
  }

  const baseUrl = getShortLinkBaseUrl();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 bg-slate-950 px-4 py-10 text-white">
      <Link
        href="/"
        className="text-sm font-semibold text-slate-400 transition hover:text-white"
      >
        ← Back to dashboard
      </Link>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Short link</p>
            <p className="mt-1 text-3xl font-semibold text-indigo-200">{code}</p>
          </div>
          <CopyButton text={`${baseUrl}/${code}`} />
        </div>
        <div className="rounded-xl bg-slate-950/40 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-wide text-slate-500">Destination</p>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="break-all text-base text-white underline-offset-4 hover:underline"
          >
            {link.url}
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total clicks" value={link.totalClicks.toString()} />
        <StatCard
          label="Last clicked"
          value={formatDate(link.lastClickedAt ? new Date(link.lastClickedAt) : null)}
        />
        <StatCard label="Created" value={formatDate(new Date(link.createdAt))} />
        <StatCard label="Last updated" value={formatDate(new Date(link.updatedAt))} />
      </section>
    </main>
  );
}

async function fetchLink(code: string): Promise<SerializedLink | null> {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/links/${code}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load link");
  }

  return response.json();
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

