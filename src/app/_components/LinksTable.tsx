"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { CopyButton } from "./CopyButton";
import { DeleteLinkButton } from "./DeleteLinkButton";
import type { SerializedLink } from "../types";

type Props = {
  links: SerializedLink[];
  baseUrl: string;
};

export function LinksTable({ links, baseUrl }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return links;
    const lower = query.toLowerCase();
    return links.filter(
      (link) =>
        link.code.toLowerCase().includes(lower) ||
        link.url.toLowerCase().includes(lower),
    );
  }, [links, query]);

  if (links.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center text-slate-400">
        <p className="text-lg font-semibold text-slate-100">No links yet</p>
        <p className="mt-2 text-sm text-slate-400">
          Your tiny links will show up here once you create them.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-inner shadow-black/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">All links</p>
          <p className="text-sm text-slate-400">
            {filtered.length} of {links.length} showing
          </p>
        </div>
        <input
          type="search"
          placeholder="Search by code or URL"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:w-60"
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2 font-semibold">Short code</th>
              <th className="px-3 py-2 font-semibold">Target URL</th>
              <th className="px-3 py-2 font-semibold">Total clicks</th>
              <th className="px-3 py-2 font-semibold">Last clicked</th>
              <th className="px-3 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((link) => (
              <tr
                key={link.id}
                className="border-t border-slate-800/60 text-slate-100 hover:bg-slate-900/60"
              >
                <td className="px-3 py-3 font-mono text-sm">
                  <Link
                    href={`/code/${link.code}`}
                    className="text-indigo-300 hover:text-indigo-200"
                  >
                    {link.code}
                  </Link>
                </td>
                <td className="px-3 py-3 text-slate-300">
                  <span title={link.url} className="inline-block max-w-xs truncate align-middle">
                    {link.url}
                  </span>
                </td>
                <td className="px-3 py-3 text-white">{link.totalClicks}</td>
                <td className="px-3 py-3 text-slate-300">
                  {formatDate(link.lastClickedAt ? new Date(link.lastClickedAt) : null)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <CopyButton text={`${baseUrl}/${link.code}`} />
                    <Link
                      href={`/code/${link.code}`}
                      className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-200"
                    >
                      Stats
                    </Link>
                    <DeleteLinkButton code={link.code} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

